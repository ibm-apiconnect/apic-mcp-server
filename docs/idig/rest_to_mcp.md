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
- **Note**: This tool is available in IBM API Studio and for [BYOCA](./byoca.md)

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

#### Table 1. Parameters for IBM API Studio
| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| spec   | Yes    | The OpenAPI specification from which the MCP Specification is to be generated. | None |
| selectedOperations   | No    | An optional map of operations to be included as tools. | None |
| xIbmProject   | No    | An optional namespace of the studio project. | None |

**Note:** By default, all operations are included as tools if `selectedOperations` is not specified.

**Sample Prompts (IBM API Studio)**:

```text
Generate a MCP spec for @openapi_file.
```

```text
Create a MCP Spec for this OpenAPI @openapi_file.
```

```text
Convert this OpenAPI @openapi_file to MCP for these operations: {"/pets": ["get", "post"]}.
```

```text
Generate a MCP spec for @openapi_file in the apic-project namespace.
```

#### Table 2. Parameters for [BYOCA](./byoca.md)
| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| specFilePath  | Yes    | The absolute file path to the OpenAPI specification file from which the MCP Specification is to be generated. | None |
| selectedOperations   | No    | An optional map of operations to be included as tools. | None |
| xIbmProject   | No    | An optional namespace of the studio project. | None |

**Sample Prompts (BYOCA)**:

```text
Generate a MCP spec for /path/to/openapi_file.yaml
```

```text
Convert /path/to/openapi_file.yaml to MCP for these operations: {"/pets": ["get", "post"]}
```

**API Agent Quick Commands**
```text
/rest_to_mcp_generator spec: @openapi_file
```
```text
/rest_to_mcp_generator spec: @openapi_file selectedOperations: {"/pets": ["get", "post"]}
```

**Next Action Suggested**:
- Enhance the MCP tools in the generated file using the [MCP Tools Enhancer](./mcp_tools_enhancer.md)

For more information, see [Working with MCP tools and server with IBM DataPower Interact Gateway](https://ibmdocs-test.dcs.ibm.com/docs/en/v12saas_internal_test?topic=gateway-working-mcp-tools-server).
