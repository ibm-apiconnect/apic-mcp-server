---
name: apic-openapi-operation-selector
description: >
  Use this skill whenever you need to let the user choose which OpenAPI/Swagger
  operations to include before converting or processing a REST spec — for example
  as the pre-step for RestToMCPGenerator (REST-to-MCP conversion), or any other
  flow that requires a selectedOperations map (path → HTTP methods). Presents
  every path+method as a numbered list, waits for the user's selection, and
  returns a JSON object mapping paths to HTTP method arrays ready to pass as
  the `selectedOperations` argument.
---

# OpenAPI Operation Selector

Use this skill whenever:

- The user wants to **convert a REST/OpenAPI spec to MCP** (via `RestToMCPGenerator`) and has **not already provided `selectedOperations`** — this skill is the required pre-step that collects the selection.
- Any other tool or workflow needs a `selectedOperations` map (an object mapping paths to arrays of HTTP methods) before it can proceed.
- The user says things like "which operations should I include?", "let me pick the endpoints", "select operations from my spec", or "convert some operations from this OpenAPI file".

Concretely: when `RestToMCPGenerator` responds with `"WAITING ON USER INPUT for selectedOperations"`, **activate this skill immediately** to collect the selection, then re-invoke `RestToMCPGenerator` with the resulting `selected` object as `selectedOperations`.

## Inputs

- Path to an OpenAPI file in JSON, YAML, or YML format

**Before running any script**, verify the user has provided a valid file path. If the path has not been supplied, ask for it and do not proceed until it is given.

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

Run the supporting Node.js script at [`select-operations.js`](.bob/skills/apic-openapi-operation-selector/select-operations.js).

### Step 1: Produce numbered options

```bash
node ./.bob/skills/apic-openapi-operation-selector/select-operations.js ./path/to/openapi.yml --list
```

This prints JSON containing:

- `openApiFile`
- `instructions`
- `options` with `index`, `label`, `method`, `path`, and `operationId`

**IMPORTANT**: The agent MUST:

1. Show the numbered options to the user in a clear, readable format, using the `label` values **exactly as returned by the script** without reformatting them
2. Ask the user which operations they want to select
3. WAIT for the user to respond with their selection (e.g., "1,3,4" or "all" or "1")
4. NEVER proceed to Step 2 without explicit user input
5. If the script returns an empty `options` array, tell the user there are no selectable operations and stop

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
node ./.bob/skills/apic-openapi-operation-selector/select-operations.js ./path/to/openapi.yml --select-indexes "1,2"
```

Replace "1,2" with the actual indexes the user provided in their response.

This prints JSON containing:

- `selectedIndexes`
- `selected`
- `selectedOperations`

The `selected` object is the **final output to present to the user** — show only this JSON object, not the full response. It maps paths to arrays of HTTP methods in lowercase.

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

## Handoff after selection

Once Step 2 has produced the `selected` object, **resume the originating tool or workflow** using that object:

- **For `RestToMCPGenerator`**: call the tool again, passing the `selected` JSON (stringified) as the `selectedOperations` argument and the same OpenAPI file. Do not ask the user to re-enter anything else.

Example re-invocation for the RestToMCP flow:

```
RestToMCPGenerator(spec=<same-file>, selectedOperations='{"\/weather":["get"],"\/pets":["post"]}')
```

## Notes

- If the file is invalid or has no `paths` object, treat it as having no selectable operations
- If duplicate item numbers are entered, return each selected label once
- Preserve deterministic ordering based on path order and HTTP method order in the source document
- The script provides data for a chat-driven or UI-driven selection flow, which is clearer than relying on raw terminal prompts
