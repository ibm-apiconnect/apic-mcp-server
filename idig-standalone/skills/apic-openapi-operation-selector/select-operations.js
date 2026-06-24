#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];

function printUsage() {
    console.error('Usage: node ./.bob/skills/apic-openapi-operation-selector/select-operations.js <openapi-file> [--list | --select-indexes "1,3,4"]');
}

function parseArgs(argv) {
    const args = argv.slice(2);
    let filePath = null;
    let listOnly = false;
    let selectedIndexesRaw = null;

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (arg === '--list') {
            listOnly = true;
            continue;
        }

        if (arg === '--select-indexes') {
            const value = args[index + 1];
            if (!value) {
                throw new Error('Missing value for --select-indexes');
            }
            selectedIndexesRaw = value;
            index += 1;
            continue;
        }

        if (arg.startsWith('--')) {
            throw new Error(`Unknown option: ${arg}`);
        }

        if (filePath) {
            throw new Error(`Unexpected argument: ${arg}`);
        }

        filePath = arg;
    }

    if (!filePath) {
        throw new Error('Missing OpenAPI file path');
    }

    return {
        filePath,
        listOnly,
        selectedIndexesRaw,
    };
}

function parseSimpleYamlScalar(rawValue) {
    const value = rawValue.trim();

    if (value === 'null') {
        return null;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return Number(value);
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }

    return value;
}

function parseSimpleYaml(content) {
    const root = {};
    const stack = [{ indent: -1, container: root }];
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) {
            continue;
        }

        const indent = line.match(/^ */)[0].length;
        const trimmed = line.trim();

        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
            stack.pop();
        }

        const current = stack[stack.length - 1].container;
        const keyValueMatch = trimmed.match(/^([^:]+):(.*)$/);

        if (!keyValueMatch) {
            continue;
        }

        const key = keyValueMatch[1].trim();
        const rawValue = keyValueMatch[2];

        if (!rawValue.trim()) {
            current[key] = {};
            stack.push({ indent, container: current[key] });
            continue;
        }

        current[key] = parseSimpleYamlScalar(rawValue);
    }

    return root;
}

function parseOpenApiFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.json') {
        return JSON.parse(content);
    }

    if (extension === '.yaml' || extension === '.yml') {
        try {
            return JSON.parse(content);
        } catch (jsonError) {
            return parseSimpleYaml(content);
        }
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        return parseSimpleYaml(content);
    }
}

function buildOperations(document) {
    const pathsObject = document && typeof document === 'object' ? document.paths : null;
    if (!pathsObject || typeof pathsObject !== 'object') {
        return [];
    }

    const operationIdCounts = new Map();

    for (const [apiPath, pathItem] of Object.entries(pathsObject)) {
        if (!pathItem || typeof pathItem !== 'object') {
            continue;
        }

        for (const [method, operation] of Object.entries(pathItem)) {
            const normalizedMethod = String(method).toLowerCase();
            if (!HTTP_METHODS.includes(normalizedMethod)) {
                continue;
            }

            if (operation && typeof operation === 'object' && typeof operation.operationId === 'string') {
                const operationId = operation.operationId.trim();
                if (operationId) {
                    operationIdCounts.set(operationId, (operationIdCounts.get(operationId) || 0) + 1);
                }
            }
        }
    }

    const operations = [];

    for (const [apiPath, pathItem] of Object.entries(pathsObject)) {
        if (!pathItem || typeof pathItem !== 'object') {
            continue;
        }

        for (const methodName of HTTP_METHODS) {
            const operation = pathItem[methodName];
            if (!operation || typeof operation !== 'object') {
                continue;
            }

            const method = methodName.toUpperCase();
            const operationId = typeof operation.operationId === 'string' ? operation.operationId.trim() : '';
            const label = operationId && operationIdCounts.get(operationId) === 1 ? operationId : `${method} ${apiPath}`;

            operations.push({
                index: operations.length + 1,
                label,
                method,
                path: apiPath,
                operationId: operationId || null,
            });
        }
    }

    return operations;
}

function parseSelectedIndexes(selectedIndexesRaw, operations) {
    if (!selectedIndexesRaw) {
        return [];
    }

    const maxIndex = operations.length;
    const parts = selectedIndexesRaw
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) {
        throw new Error('No index selections were provided');
    }

    const indexes = parts.map((part) => {
        if (!/^\d+$/.test(part)) {
            throw new Error(`Invalid selection index: ${part}`);
        }

        const index = Number(part);
        if (index < 1 || index > maxIndex) {
            throw new Error(`Selection index out of range: ${part}`);
        }

        return index;
    });

    return [...new Set(indexes)];
}

function buildListPayload(filePath, operations) {
    return {
        openApiFile: filePath,
        instructions: 'Select one or more operation numbers using a comma-separated list such as "1,3,4". Then run the script again with --select-indexes.',
        options: operations.map((operation) => ({
            index: operation.index,
            label: operation.label,
            method: operation.method,
            path: operation.path,
            operationId: operation.operationId,
        })),
    };
}

function buildSelectionPayload(filePath, operations, selectedIndexes) {
    const selectedOperations = operations.filter((operation) => selectedIndexes.includes(operation.index));

    // Build the path-to-methods object: {"/pets": ["get", "post"], ...}
    const pathToMethods = {};
    for (const operation of selectedOperations) {
        const path = operation.path;
        const method = operation.method.toLowerCase();

        if (!pathToMethods[path]) {
            pathToMethods[path] = [];
        }
        pathToMethods[path].push(method);
    }

    return {
        openApiFile: filePath,
        selectedIndexes,
        selected: pathToMethods,
        selectedOperations: selectedOperations.map((operation) => ({
            index: operation.index,
            label: operation.label,
            method: operation.method,
            path: operation.path,
            operationId: operation.operationId,
        })),
    };
}

function main() {
    try {
        const { filePath, listOnly, selectedIndexesRaw } = parseArgs(process.argv);
        const document = parseOpenApiFile(filePath);
        const operations = buildOperations(document);

        if (selectedIndexesRaw) {
            const selectedIndexes = parseSelectedIndexes(selectedIndexesRaw, operations);
            process.stdout.write(`${JSON.stringify(buildSelectionPayload(filePath, operations, selectedIndexes), null, 2)}\n`);
            return;
        }

        if (listOnly || !selectedIndexesRaw) {
            process.stdout.write(`${JSON.stringify(buildListPayload(filePath, operations), null, 2)}\n`);
            return;
        }
    } catch (error) {
        process.stderr.write(`${JSON.stringify({ error: error.message }, null, 2)}\n`);
        printUsage();
        process.exitCode = 1;
    }
}

main();

// Made with Bob
