#!/usr/bin/env node

/**
 * Kind File Packager - Recursively package Kind files with all dependencies
 *
 * This script locates Kind file assets (API, Product, MCPServer, etc.) and packages
 * them with all their dependencies by following $ref and $path references.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const archiver = require('archiver');
const { program } = require('commander');

class KindFilePackager {
    constructor(workspaceRoot) {
        this.workspaceRoot = path.resolve(workspaceRoot);
        this.processedFiles = new Set();
        this.fileQueue = [];
        this.dependencyGraph = new Map();
    }

    /**
     * Find a Kind file by name or path
     * @param {string} inputRef - Either a file name or path
     * @returns {string|null} Path to the found file, or null if not found
     */
    findKindFile(inputRef) {
        // Check if input is a direct path
        const potentialPath = path.join(this.workspaceRoot, inputRef);
        if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
            return potentialPath;
        }

        // Search for file by name
        console.log(`Searching for Kind file: ${inputRef}`);

        const searchDir = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    const result = searchDir(fullPath);
                    if (result) return result;
                } else if (entry.isFile() && (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml'))) {
                    // Check if filename matches
                    const nameWithoutExt = path.parse(entry.name).name;
                    if (nameWithoutExt === inputRef || entry.name === inputRef) {
                        if (this.isKindFile(fullPath)) {
                            console.log(`Found: ${path.relative(this.workspaceRoot, fullPath)}`);
                            return fullPath;
                        }
                    }

                    // Also check metadata.name
                    if (this.checkKindFileName(fullPath, inputRef)) {
                        console.log(`Found: ${path.relative(this.workspaceRoot, fullPath)}`);
                        return fullPath;
                    }
                }
            }
            return null;
        };

        return searchDir(this.workspaceRoot);
    }

    /**
     * Check if a file is a Kind file by looking for 'kind:' field
     * @param {string} filePath - Path to the file
     * @returns {boolean} True if it's a Kind file
     */
    isKindFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(content);
            return data && typeof data === 'object' && 'kind' in data;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if a Kind file's metadata.name matches the target name
     * @param {string} filePath - Path to the file
     * @param {string} targetName - The name to match against
     * @returns {boolean} True if the file's metadata.name matches
     */
    checkKindFileName(filePath, targetName) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(content);
            if (data && typeof data === 'object' && data.metadata && data.metadata.name) {
                return data.metadata.name === targetName;
            }
        } catch (error) {
            // Ignore errors
        }
        return false;
    }

    /**
     * Get the kind type from a Kind file
     * @param {string} filePath - Path to the file
     * @returns {string|null} The kind type or null
     */
    getKindType(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(content);
            return data && typeof data === 'object' && data.kind ? data.kind : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Parse a $ref value and locate the referenced file
     * @param {string} refValue - The $ref string value
     * @param {string} currentFile - The file containing this reference
     * @returns {string|null} Path to the referenced file, or null if not found
     */
    parseRef(refValue, currentFile) {
        // Parse namespace:name:version format
        const parts = refValue.split(':');
        if (parts.length < 2) {
            console.log(`  Warning: Invalid $ref format: ${refValue}`);
            return null;
        }

        const namespace = parts[0];
        const name = parts[1];
        const currentDir = path.dirname(currentFile);

        // Try to find file by matching metadata.name in YAML files
        // First check current directory
        const currentDirFiles = fs
            .readdirSync(currentDir)
            .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
            .map((f) => path.join(currentDir, f));

        for (const filePath of currentDirFiles) {
            if (this.checkKindFileName(filePath, name)) {
                return filePath;
            }
        }

        // Search in namespace directory (if different from current)
        if (namespace) {
            const namespaceDir = path.join(path.dirname(currentDir), namespace);
            if (fs.existsSync(namespaceDir) && fs.statSync(namespaceDir).isDirectory()) {
                const namespaceDirFiles = fs
                    .readdirSync(namespaceDir)
                    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
                    .map((f) => path.join(namespaceDir, f));

                for (const filePath of namespaceDirFiles) {
                    if (this.checkKindFileName(filePath, name)) {
                        return filePath;
                    }
                }
            }
        }

        // Broader search in current directory tree
        const searchInDir = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    const result = searchInDir(fullPath);
                    if (result) return result;
                } else if (entry.isFile() && (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml'))) {
                    if (this.checkKindFileName(fullPath, name)) {
                        return fullPath;
                    }
                }
            }
            return null;
        };

        const result = searchInDir(currentDir);
        if (!result) {
            console.log(`  Warning: Could not locate $ref: ${refValue}`);
        }
        return result;
    }

    /**
     * Parse a $path value and locate the referenced file
     * @param {string} pathValue - The $path string value
     * @param {string} currentFile - The file containing this reference
     * @returns {string|null} Path to the referenced file, or null if not found
     */
    parsePath(pathValue, currentFile) {
        const currentDir = path.dirname(currentFile);

        // Resolve relative path
        let referencedFile;
        if (pathValue.startsWith('./') || pathValue.startsWith('../')) {
            referencedFile = path.resolve(currentDir, pathValue);
        } else {
            // Try as absolute path from workspace root
            referencedFile = path.resolve(this.workspaceRoot, pathValue);
        }

        if (fs.existsSync(referencedFile)) {
            return referencedFile;
        }

        console.log(`  Warning: Could not locate $path: ${pathValue}`);
        return null;
    }

    /**
     * Extract all $ref and $path references from a file
     * @param {string} filePath - Path to the file to parse
     * @returns {string[]} List of referenced file paths
     */
    extractReferences(filePath) {
        const references = [];

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(content);

            // Recursively search for $ref and $path in the YAML structure
            const findRefs = (obj) => {
                if (typeof obj === 'object' && obj !== null) {
                    if (Array.isArray(obj)) {
                        obj.forEach((item) => findRefs(item));
                    } else {
                        for (const [key, value] of Object.entries(obj)) {
                            if (key === '$ref' && typeof value === 'string') {
                                const refFile = this.parseRef(value, filePath);
                                if (refFile) {
                                    references.push(refFile);
                                }
                            } else if (key === '$path' && typeof value === 'string') {
                                const pathFile = this.parsePath(value, filePath);
                                if (pathFile) {
                                    references.push(pathFile);
                                }
                            } else {
                                findRefs(value);
                            }
                        }
                    }
                }
            };

            findRefs(data);
        } catch (error) {
            console.log(`  Error parsing ${path.basename(filePath)}: ${error.message}`);
        }

        return references;
    }

    /**
     * Process a file and add its dependencies to the queue
     * @param {string} filePath - Path to the file to process
     */
    processFile(filePath) {
        if (this.processedFiles.has(filePath)) {
            return;
        }

        console.log(`\nProcessing: ${path.relative(this.workspaceRoot, filePath)}`);
        this.processedFiles.add(filePath);

        // Extract references
        const references = this.extractReferences(filePath);
        this.dependencyGraph.set(filePath, references);

        // Add new references to queue
        for (const refFile of references) {
            if (!this.processedFiles.has(refFile)) {
                console.log(`  Found dependency: ${path.relative(this.workspaceRoot, refFile)}`);
                this.fileQueue.push(refFile);
            }
        }
    }

    /**
     * Build complete dependency graph starting from a file
     * @param {string} startFile - The initial Kind file to start from
     */
    buildDependencyGraph(startFile) {
        this.fileQueue.push(startFile);

        while (this.fileQueue.length > 0) {
            const currentFile = this.fileQueue.shift();
            this.processFile(currentFile);
        }
    }

    /**
     * Create a zip archive with all processed files
     * @param {string} outputPath - Path for the output zip file
     * @returns {Promise<{fileCount: number, archiveSize: number}>}
     */
    async createZipArchive(outputPath) {
        console.log(`\n${'='.repeat(60)}`);
        console.log('Creating zip archive...');
        console.log('='.repeat(60));

        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', {
                zlib: { level: 9 },
            });

            output.on('close', () => {
                const archiveSize = archive.pointer();
                resolve({ fileCount: this.processedFiles.size, archiveSize });
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            // Add all processed files to the archive
            // If files are at workspace root, use workspace name as subdirectory
            // Otherwise use 'project' as default subdirectory
            const sortedFiles = Array.from(this.processedFiles).sort();

            // Determine if files are at workspace root or in subdirectories
            let useWorkspaceName = true;
            for (const filePath of sortedFiles) {
                const relativePath = path.relative(this.workspaceRoot, filePath);
                if (relativePath.includes(path.sep)) {
                    useWorkspaceName = false;
                    break;
                }
            }

            const subdirName = useWorkspaceName ? path.basename(this.workspaceRoot) : 'project';

            for (const filePath of sortedFiles) {
                const filename = path.basename(filePath);
                const arcname = path.join(subdirName, filename);
                archive.file(filePath, { name: arcname });
                console.log(`  Added: ${arcname}`);
            }

            archive.finalize();
        });
    }

    /**
     * Print summary of the packaging operation
     * @param {string} outputPath - Path to the output zip file
     * @param {number} fileCount - Number of files packaged
     * @param {number} archiveSize - Size of the archive in bytes
     */
    printSummary(outputPath, fileCount, archiveSize) {
        console.log(`\n${'='.repeat(60)}`);
        console.log('PACKAGING COMPLETE');
        console.log('='.repeat(60));
        console.log(`Total files packaged: ${fileCount}`);
        console.log(`Archive size: ${archiveSize.toLocaleString()} bytes (${(archiveSize / 1024).toFixed(2)} KB)`);
        console.log(`Output file: ${outputPath}`);
        console.log('\nFiles included:');

        const sortedFiles = Array.from(this.processedFiles).sort();
        for (const filePath of sortedFiles) {
            console.log(`  - ${path.relative(this.workspaceRoot, filePath)}`);
        }
    }

    /**
     * Main packaging function
     * @param {string} inputRef - Name or path of the Kind file to package
     * @param {string} outputPath - Optional custom output path for the zip file
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    async package(inputRef, outputPath = null) {
        // Find the starting file
        const startFile = this.findKindFile(inputRef);
        if (!startFile) {
            console.error(`Error: Could not find Kind file: ${inputRef}`);
            return false;
        }

        // Validate that it's a supported top-level Kind
        const kindType = this.getKindType(startFile);
        const supportedKinds = ['API', 'Product', 'MCPServer', 'LLMProvider'];

        if (!supportedKinds.includes(kindType)) {
            console.error(`\nError: Top-level Kind file must be one of: ${supportedKinds.join(', ')}`);
            console.error(`Found: ${kindType || 'unknown'}`);
            console.error(`File: ${path.relative(this.workspaceRoot, startFile)}`);
            return false;
        }

        console.log(`\nPackaging ${kindType}: ${path.basename(startFile)}`);

        // Build dependency graph
        console.log(`\n${'='.repeat(60)}`);
        console.log('Building dependency graph...');
        console.log('='.repeat(60));
        this.buildDependencyGraph(startFile);

        // Determine output path
        if (!outputPath) {
            const kindName = path.parse(startFile).name;
            outputPath = `${kindName}_package.zip`;
        }

        // Create archive
        const { fileCount, archiveSize } = await this.createZipArchive(outputPath);

        // Print summary
        this.printSummary(outputPath, fileCount, archiveSize);

        return true;
    }
}

// Main entry point
async function main() {
    program
        .name('package-kind-files')
        .description('Package Kind files with all their dependencies')
        .requiredOption('-i, --input <name>', 'Name or path of the Kind file to package')
        .requiredOption('-w, --workspace <path>', 'Path to the workspace root directory')
        .option('-o, --output <path>', 'Output zip file path (default: {kind_name}_package.zip)')
        .addHelpText(
            'after',
            `
Examples:
  # Package by name
  node package_kind_files.js -i "DPv6_Product" -w "api-studio-samples/projects/v1"

  # Package by path
  node package_kind_files.js -i "datapower-api-gateway/DPv6_Product_Weather/DPv6_Product.yml" -w "api-studio-samples/projects/v1"

  # Custom output name
  node package_kind_files.js -i "WeatherApi" -w "api-studio-samples/projects/v1" -o "my_package.zip"
        `,
        );

    program.parse();
    const options = program.opts();

    // Validate workspace
    if (!fs.existsSync(options.workspace)) {
        console.error(`Error: Workspace directory does not exist: ${options.workspace}`);
        process.exit(1);
    }

    // Create packager and run
    const packager = new KindFilePackager(options.workspace);
    const success = await packager.package(options.input, options.output);

    process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
    main().catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
}

module.exports = KindFilePackager;
