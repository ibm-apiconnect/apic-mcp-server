# MCP to MCP Generator

## MCPToolsList

**Tool name**: MCPToolsList

**Description**: Retrieves the list of tools available in an MCP Server. Requires MCP server URL and authentication if any (token OR apiKey).

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `mcpServerUrl` | Yes | URL of the MCP server | - |
| `token` | No | Authentication token (use token OR apiKey, not both) | - |
| `apiKey` | No | Authentication API key (use token OR apiKey, not both) | - |
| `mcpServerName` | No | Name of the MCP server | - |
| `description` | No | Description of the MCP server | `"MCP Server Tools"` |
| `version` | No | Version of the MCP server | `"1.0.0"` |

### Example Prompts

```text
Show me the tools available in the GitHub Copilot MCP server at https://api.githubcopilot.com/mcp/ with token ghp_exampleToken123
```

```text
List the tools from my MCP server named example server at https://api.example.com/mcp using API key api_key_example_456
```

```text
Fetch the available tools from my MCP server at https://support.example.com/mcp
```

---

## MCPToMCPGenerator

**Tool name**: MCPToMCPGenerator

**Description**: Converts an MCP Server into MCP Kind file specifications. Generates MCP Server and MCP Tools KIND files for IBM DataPower Interact Gateway.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `mcpServerUrl` | Yes | URL of the MCP server | - |
| `token` | No | Authentication token for the MCP server | - |
| `apiKey` | No | Authentication API key for the MCP server | - |
| `mcpServerName` | No | Name of the MCP server | - |
| `description` | No | Description of the MCP server | `"MCP Server Tools"` |
| `version` | No | Version of the MCP server | `"1.0.0"` |
| `selectedTools` | No | Selected tools to register (JSON format or comma-separated) | - |
| `xIbmProject` | No | Namespace of the active project | `"default-project"` |

### Example Prompts

```text
Register github MCP server url https://api.github.com and token abc123 in the apic-dev namespace
```

```text
Register slack MCP server url https://api.slack.com/mcp and apikey slack_key_456 in the production namespace
```

```text
Generate kind files for jira MCP server url https://jira.example.com/mcp and token jira_token_789 in the dev-project namespace
```

```text
Register confluence MCP server url https://confluence.example.com/mcp and token conf_token_321 with tools search, create, update, delete in the docs-project namespace
```

```text
Generate kind files for trello MCP server url https://api.trello.com/mcp and apikey trello_key_654 with tools getboards, getcards in the project-mgmt namespace
```
