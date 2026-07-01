#  Rest To MCP Generator

- [Tool Details](#tool-details)
- [Operation details](#operation-details)
  1. [Generate MCP Specifications from an OpenAPI file](#generate-mcp-specifications-from-an-openapi-file)


## Tool Details

**Tool name**: REST to MCP Generator
  
**Tool description**: The REST to MCP generator tool creates MCP Kind specifications from an OpenAPI file. This tool helps generate MCP specifications, including an MCP Server, MCP Tools, and the policy files required to publish the MCP Server to the IBM DataPower Interact Gateway.

**Tool Details**:
- This tool assists users with the task of generating MCP Servers from their OpenAPI specifications.
- The generated MCP tools are created from the available operations in the OpenAPI specification.

## Operation details

### Generate MCP Specifications from an OpenAPI file

**Description**: You can generate MCP specifications from your OpenAPI with this tool.

This Operation displays the following details:

- The MCP Specification files and policy files, which include the following;
    - MCP Server
    - MCP Tools
    - Invoke Policy
    - Telemetry
    - FreeFlowPolicySequence
    - Quota
    - OpenAPI specification

**Parameters**:

#### Table 1. Parameters for the Generate MCP Specifications from an OpenAPI file operation
| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| specFilePath  | Yes    | The absolute file path to the OpenAPI specification file from which the MCP Specification is to be generated. | None |
| selectedOperations   | No    | An optional map of operations to be included as tools. | None |
| xIbmProject   | No    | An optional namespace of the studio project. | None |

**Sample Prompts**:

```text
Generate a MCP spec for /path/to/openapi_file.yaml
```

```text
Convert /path/to/openapi_file.yaml to MCP for these operations: {"/pets": ["get", "post"]}
```

## Skills

### apic-openapi-operation-selector

The OpenAPI Operation Selector skill helps you select specific operations from an OpenAPI specification that should be converted to MCP tools. The skill reads your OpenAPI file and creates a map of paths and HTTP methods, allowing you to choose which operations to include in the conversion.

**How it works:**
1. The skill analyzes your OpenAPI file and presents all available operations as numbered options
2. You select the operations you want to convert by providing their corresponding numbers
3. The skill generates a JSON mapping of selected paths to HTTP methods

**Integration with REST to MCP:**
This skill can be triggered immediately after invoking the REST to MCP tool. The tool automatically uses the output of this skill as the `selectedOperations` parameter.

**Installation:**
This skill should already be installed if you used the `init-apic-mcp` command for Bob setup. Otherwise, you can install it by following [these steps](../../../init-apic-mcp.md#9b-install-skills-for-bob-agent).

**Sample Usage:**

```text
/openapi-select-operations @openapi_file.json
```

**Next Action Suggested**:
- Enhance the MCP tools in the generated file using the [MCP Tools Enhancer](./mcp_tools_enhancer.md)

For more information, see [Working with MCP tools and server with IBM DataPower Interact Gateway](https://ibmdocs-test.dcs.ibm.com/docs/en/v12saas_internal_test?topic=gateway-working-mcp-tools-server).
