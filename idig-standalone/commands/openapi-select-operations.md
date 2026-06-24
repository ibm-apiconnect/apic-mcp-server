---
description: Select operations from an OpenAPI file using the OpenAPI Operation Selector skill
---

Use the [OpenAPI Operation Selector](.bob/skills/openapi-operation-selector/SKILL.md) skill.

Required input:

- OpenAPI file path

Workflow:

1. Verify the user has provided the path to an OpenAPI or Swagger file in JSON, YAML, or YML format.
2. Run:

    ```bash
    node ./.bob/skills/apic-openapi-operation-selector/select-operations.js "<OPENAPI_FILE_PATH>" --list
    ```

3. Present the returned numbered options to the user in chat in a clear readable list.
4. Ask the user which operations they want to select.
5. Wait for the user to reply with a comma-separated list of indexes such as `1,3,4`.
6. Do not proceed until the user has explicitly provided their selection.
7. Run:

    ```bash
    node ./.bob/skills/apic-openapi-operation-selector/select-operations.js "<OPENAPI_FILE_PATH>" --select-indexes "<USER_SELECTED_INDEXES>"
    ```

8. Return the `selected` JSON object mapping paths to arrays of lowercase HTTP methods.

Important rules:

- Do not use `--select-indexes` before the user has replied with explicit indexes.
- Show operation labels exactly as provided by the selector output.
- If the script returns no selectable operations, tell the user there are no operations to select.
- The final output to the user is the JSON object from the `selected` field.
