---
name: apic-openapi-operation-selector
description: Present OpenAPI operations as numbered options, then return the chosen items as a JSON object mapping paths to HTTP methods.
---

# OpenAPI Operation Selector

Use this skill when you need to inspect an OpenAPI or Swagger file, derive every unique path and HTTP method combination, present them to the user as numbered selectable options, collect the user's numeric choices, and only then print the chosen values as a JSON object mapping paths to their HTTP methods.

## Inputs

- Path to an OpenAPI file in JSON, YAML, or YML format

## Selection behavior

- The skill must not rely on terminal-only interactive prompts as the primary selection UX
- The script should first produce a structured list of numbered options
- The agent MUST present those options to the user in chat and WAIT for the user's response
- The user MUST reply with a comma-separated list of option numbers such as `1,3,4`
- CRITICAL: The agent MUST NOT use `--select-indexes` until the user has explicitly provided the indexes to select
- Only after the user has chosen numbers should the script be run again to produce the selected array

## Selection label rules

- If an operation has an `operationId` and that `operationId` is unique across the entire document, show the `operationId`
- Otherwise show `<http-method> <path>`
- Ignore non-operation keys under a path item such as `summary`, `description`, `parameters`, and `servers`

## Implementation

Run the supporting Node.js script at [`select-operations.js`](.bob/skills/openapi-operation-selector/select-operations.js).

### Step 1: Produce numbered options

```bash
node ./.bob/skills/openapi-operation-selector/select-operations.js ./path/to/openapi.yml --list
```

This prints JSON containing:

- `openApiFile`
- `instructions`
- `options` with `index`, `label`, `method`, `path`, and `operationId`

**IMPORTANT**: The agent MUST:

1. Show the numbered options to the user in a clear, readable format
2. Ask the user which operations they want to select
3. WAIT for the user to respond with their selection (e.g., "1,3,4" or "all" or "1")
4. NEVER proceed to Step 2 without explicit user input

Example options payload shape:

```json
{
    "openApiFile": "./example.yml",
    "instructions": "Select one or more operation numbers using a comma-separated list such as \"1,3,4\". Then run the script again with --select-indexes.",
    "options": [
        {
            "index": 1,
            "label": "getWeather",
            "method": "GET",
            "path": "/weather",
            "operationId": "getWeather"
        },
        {
            "index": 2,
            "label": "POST /pets",
            "method": "POST",
            "path": "/pets",
            "operationId": null
        }
    ]
}
```

### Step 2: Resolve the user's numeric selections

**CRITICAL**: Only execute this step AFTER the user has provided their selection.

```bash
node ./.bob/skills/openapi-operation-selector/select-operations.js ./path/to/openapi.yml --select-indexes "1,2"
```

Replace "1,2" with the actual indexes the user provided in their response.

This prints JSON containing:

- `selectedIndexes`
- `selected`
- `selectedOperations`

The `selected` object is the final value to show as the user's chosen operations, formatted as a JSON object mapping paths to arrays of HTTP methods (in lowercase).

Example final output shape:

```json
{
    "selectedIndexes": [1, 2],
    "selected": {
        "/weather": ["get"],
        "/pets": ["post"]
    }
}
```

If multiple methods are selected for the same path, they will be grouped together:

```json
{
    "selectedIndexes": [1, 2, 3],
    "selected": {
        "/pets": ["get", "post"],
        "/stores": ["delete"]
    }
}
```

## Notes

- If the file is invalid or has no `paths` object, treat it as having no selectable operations
- If duplicate item numbers are entered, return each selected label once
- Preserve deterministic ordering based on path order and HTTP method order in the source document
- The script provides data for a chat-driven or UI-driven selection flow, which is clearer than relying on raw terminal prompts
