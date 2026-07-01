# IBM Datapower Interact Gateway (IDIG) MCP Server

The IDIG MCP Server is a comprehensive Model Context Protocol (MCP) server designed for seamless integration with MCP clients and AI assistants. This server provides powerful tools for managing and interacting with the IBM DataPower Interact Gateway (IDIG) platform.

## Overview

This MCP server enables users to perform essential tasks for the IDIG platform, including:
- Generating and managing LLM provider connections
- Converting REST APIs to MCP specifications
- Enhancing MCP tool definitions
- Publishing assets to the IDIG platform
- Analyzing AI/LLM usage and analytics
- Converting between MCP server formats

## Available Tools

### LLM Provider Management
- **[ListLLMProviders](./docs/llm_provider_generation.md#listllmproviders)** - List available LLM providers for generation (Azure OpenAI, Gemini, OpenAI, WatsonX, Custom)
- **[LLMProviderGenerator](./docs/llm_provider_generation.md#llmprovidergenerator)** - Generate KIND documents for registering LLM providers with IDIG

### MCP Generation & Enhancement
- **[REST to MCP Generator](./docs/rest_to_mcp.md#rest-to-mcp-generator)** - Convert OpenAPI specifications to MCP Server and Tool definitions
- **[MCP Tools Enhancer](./docs/mcp_tools_enhancer.md#mcp-tools-enhancer)** - Enhance MCP tool names, descriptions, and parameter definitions for better AI agent understanding
- **[MCPToolsList](./docs/mcp_to_mcp.md#mcptoolslist)** - Retrieve the list of tools available in an MCP Server
- **[MCPToMCPGenerator](./docs/mcp_to_mcp.md#mcptomcpgenerator)** - Convert an MCP Server into MCP Kind file specifications for IDIG

### Publishing & Analytics
- **[Project Publish Tool](./docs/publish_assets.md#project-publish-tool)** - Publish project assets (zip files) to the IDIG platform
- **[GetAnalyticsAILLM](./docs/ai_analytics.md#analytics-ai-llm)** - Track AI/LLM usage, token consumption, model popularity, and performance metrics
- **[GetAnalyticsMCP](./docs/ai_analytics.md#analytics-mcp)** - Track MCP usage, call volumes, tool popularity, and consumer organization metrics

## Quick Start

> **Prerequisites:** Node.js and `npx` must be available on your system. For full setup details, see the [APIC MCP Server setup guide](https://github.com/ibm-apiconnect/apic-mcp-server/blob/main/README.md).

**Step 1:** Install the `init-apic-ai-assets` skill

- **VSCode (GitHub Copilot)**
  ```shell
  npx -y skills add https://github.com/ibm-apiconnect/apic-mcp-server/skills -a github-copilot
  ```
- **IBM Bob**
  ```shell
  npx -y skills add https://github.com/ibm-apiconnect/apic-mcp-server/skills -a bob
  ```

**Step 2:** Invoke the skill in the Agent chat and follow the instructions.
```text
/init-apic-ai-assets
```

## Requirements

- Node.js (version specified in package.json)
- Access to IBM DataPower Interact Gateway platform
- Valid authentication credentials for IDIG operations

## Documentation

For detailed information about each tool, including parameters, examples, and usage patterns, please refer to the individual documentation files linked above.

## Support

For issues, questions, or contributions, please refer to the [APIC MCP Server repository](https://github.com/ibm-apiconnect/apic-mcp-server).
