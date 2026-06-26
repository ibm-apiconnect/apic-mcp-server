#  MCP Tools Enhancer

- [Tool Details](#tool-details)
- [Operation details](#operation-details)
  1. [Enhance MCP Tools](#enhance-mcp-tools)


## Tool Details

**Tool name**: MCP Tools Enhancer
  
**Tool description**: The MCP Tools Enhancer tool enhances the tool name, tool descriptions, and tool parameter descriptions available in an MCP tools kind file. This enhancement is helpful to improve the tool names and descriptions to MCP standards. This enhancement also helps AI agents understand the semantic context of each tool's operations and parameters.

**Tool Details**:
- This tool helps with the task of enhancing MCP tools with better tool names, tool descriptions, and tool parameter descriptions.
- The tool can be used after the [Rest To MCP Generator](./rest_to_mcp.md) tool to enhance the fields in the generated MCPTools kind file.
- It can also be used to augment already existing MCPTools specifications to get better tool selections from AI Agents.
- **Note**: This tool is only available in IBM API Studio

## Operation details

### Enhance MCP Tools

**Description**: You can enhance all the tool names, tool descriptions, and tool parameter descriptions present in an MCPTools specification.

This Operation displays the following detail:

- The Enhanced MCPTools kind file.

**Parameters**:

#### Table 1. Parameters for the Enhance MCP Tools operation
| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| mcpSpecFilePath   | Yes    | The absolute file path to the MCPTools Kind file containing the MCP tools to be enhanced. | None |

**Sample Prompts**:

```text
Enhance the MCP tools in /path/to/mcptool_file.yaml
```

**IBM API Agent Quick Commands**
```text
/mcp_tools_enhancer mcpSpec: @mcptool_file
```

For more information please see the [Working with MCP tools and server with IBM DataPower Interact Gateway](https://ibmdocs-test.dcs.ibm.com/docs/en/v12saas_internal_test?topic=gateway-working-mcp-tools-server)
