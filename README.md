# apic-mcp-server

> IBM APIC MCP server exposes API Connect capabilities to your MCP clients and AI Agent workflows.

## ![mcp](svg/mcp.icon.badge.svg) Using `apic-mcp-server` with MCP Clients

This MCP server can be integrated with various MCP clients such as **Claude Desktop**, **VS Code**, and **Langflow** etc.

## 📰 Blogs

[IBM API Connect MCP Server](https://community.ibm.com/community/user/blogs/goutham-shivanna/2026/01/26/ibm-api-connect-mcp-server)

[Exploring IBM API Connect v12.1.0 API Analytics with the API Agent's Analytics MCP Tool](https://community.ibm.com/community/user/blogs/michael-osullivan/2025/12/23/apic-api-analytics-with-the-api-agent)

### 💻 Suggested MCP Clients

[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](https://code.visualstudio.com/) [![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-D97757?logo=claude&logoColor=fff)](https://claude.ai/download) [![Langflow](svg/langflow.badge.svg)](https://www.langflow.org/)

### ✅ Prerequisites

- Existing API Connect v10 or v12 customer either on SaaS or on-prem
  - Your _`provider organization`_ name
  - _`API key`_ to connect with you API Connect instance
  - _`Client ID`_ configured on your API Connect instance
  - _`Client Secret`_ configured on your API Connect instance
  - _`APIC Platform Endpoint`_ of your instance
  - _`APIC Management Endpoint`_ of your instance
- _`npm package`_ tar file **`OR`** the _`.mcpb`_ installer of the API Connect service (e.g., [Analytics](./analytics))
- One of the [`suggested MCP Client`](#-suggested-mcp-clients) application

---

## 📄 Debug Logs

When running the MCP server, `INFO` level logs are written to a daily rotating file in a directory called `apic-mcp` inside your home directory by default:

- **Windows:**
  - Log files are located at `%USERPROFILE%\apic-mcp\apic-mcp-YYYY-MM-DD.log`
- **macOS / Linux:**
  - Log files are located at `~/apic-mcp/apic-mcp-YYYY-MM-DD.log`

The log directory is created automatically if it does not exist. Each log file contains one day's logs and up to 14 days of logs are retained. If the log directory cannot be created, logs are discarded.

Additionally, if you would like the log file to capture `DEBUG` level logs, update your chosen `mcp client's env` config to include the below env property:

```env
LOG_LEVEL: 'debug'
```

For example:

```json
    "servers": {
        "apic-analytics-mcp-server": {
            "command": "npx",
            "args": ["-y", "-p", "${input:tarPath}", "apic-analytics-mcp-server"],
            "env": {
                ...
                ...
                "LOG_LEVEL": "debug"
            }
        }
    }
```

---

## 📝 Setup Instructions for suggested MCP Clients

### [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/-0078d7.svg?logo=vsc&logoColor=white)`Visual Studio Code`](https://code.visualstudio.com/) `and` [![Langflow](svg/langflow.icon.svg)`Langflow`](https://www.langflow.org/)

1. **Choose the relevant template file** for your client in the specific service folder ([`mcp.vscode.json`](./analytics_build/mcp.vscode.json) or [`mcp.langflow.json`](./analytics_build/mcp.langflow.json)).
2. **Fill in your APIC configuration details** in the template.
3. **Copy the configured mcp json**
4. **Follow steps provided by the respective client to continue with the setup.**
    - Open [`VS Code MCP server setup`](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server) and expand the section **`Add an MCP server to your workspace`** for details
    - Open [`Langflow MCP server setup`](https://docs.langflow.org/mcp-client) link for details

---

### [![Claude Desktop](https://img.shields.io/badge/-D97757?logo=claude&logoColor=fff) `Claude Desktop`](https://claude.ai/download)

Claude Desktop now supports easy installation through Anthropic's new **Extensions** feature. We provide a pre-packaged `.mcpb` file for seamless setup.

**No manual configuration needed!** Simply install the `.mcpb` and follow the setup wizard.

#### Step 1: Locate the Extension File

Find the `.mcpb` file you have obtained from the specific service folder of this repository, for example:

```txt
analytics/apic-analytics-mcp-server-x.x.x.mcpb
```

where `x.x.x` is the version of the APIC MCP server

#### Step 2: Install the Extension

1. Simply double-click the `.mcpb` file
2. Claude Desktop will automatically open and start the installation process

#### Step 3: Complete the Setup

1. A setup wizard will appear asking for details _(listed in the [`prerequisites`](#-prerequisites) section)_ related to the APIC instance you would like to connect to
2. Click **Save** or **Install**
3. Ensure you **`enable`** the extension, as claude sets it as _`disabled`_ by default

#### Step 4: Start Using

Once installed, the API Connect tools exposed via the MCP server will be available in your Claude Desktop conversations.

---

## 🛠️ Available Tools

Currently available tools

|Service|Link|
|---|---|
|Analytics|[Analytics tools doc](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=tools-analytics)|

More to come soon...
