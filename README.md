# apic-mcp-server

> IBM APIC MCP server exposes API Connect capabilities to your MCP clients and AI Agent workflows.

## ![mcp](svg/mcp.icon.badge.svg) Using `apic-mcp-server` with MCP Clients

This MCP server can be integrated with various MCP clients such as **Claude Desktop**, **VS Code**, and **IBM BOB** etc.

## 📰 Blogs

[IBM API Connect MCP Server](https://community.ibm.com/community/user/blogs/goutham-shivanna/2026/01/26/ibm-api-connect-mcp-server)

[Exploring IBM API Connect v12.1.0 API Analytics with the API Agent's Analytics MCP Tool](https://community.ibm.com/community/user/blogs/michael-osullivan/2025/12/23/apic-api-analytics-with-the-api-agent)

### 💻 Suggested MCP Clients

[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](https://code.visualstudio.com/) [![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-D97757?logo=claude&logoColor=fff)](https://claude.ai/download) [![IBM BOB](svg/ibm-bob.badge.svg)](https://www.ibm.com/products/bob)

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

### [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/-0078d7.svg?logo=vsc&logoColor=white) `Visual Studio Code`](https://code.visualstudio.com/)

#### Manual Configuration

1. **Choose the template file** [`mcp.vscode.json`](./analytics/mcp.vscode.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.vscode` folder
4. **Follow the official VS Code setup guide**:
   - Open [`VS Code MCP server setup`](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server)
   - Expand the section **`Add an MCP server to your workspace`** for detailed instructions

---

### [![IBM BOB](svg/ibm-bob.icon.svg) `IBM BOB`](https://www.ibm.com/products/bob)

IBM Bob provides two setup methods: an automated command-based approach (recommended) and manual configuration.

#### Automated Setup (Recommended)

Bob includes a built-in command that automates the entire installation and configuration process:

1. **Copy the command file to your workspace**:

   **Option A: If you have the repository files locally**:

   ```bash
   # Create the commands directory if it doesn't exist
   mkdir -p .bob/commands

   # Copy the command file from the repository
   cp init-apic-mcp.md .bob/commands/
   ```

   **Option B: If reading online (download directly)**:

   ```bash
   # Create the commands directory if it doesn't exist
   mkdir -p .bob/commands

   # Download the command file directly from GitHub
   curl -o .bob/commands/init-apic-mcp.md https://github.com/ibm-apiconnect/apic-mcp-server/blob/main/init-apic-mcp.md
   ```

   This makes the `/init-apic-mcp` command available in Bob.

2. **Trigger the setup command** in Bob by typing:

   ```txt
   /init-apic-mcp
   ```

   The command will appear in the autocomplete list when you type `/` in Bob's chat.

3. **Bob will automatically**:
   - ✅ Verify prerequisites (Git, Node.js v18+, npm)
   - ✅ Create standardized directory structure at `~/apic-mcp/servers/`
   - ✅ Clone the official APIC MCP server repository
   - ✅ Discover all available MCP servers in the repository
   - ✅ Prompt you for required configuration values (API keys, URLs, etc.)
   - ✅ Generate the `.bob/mcp.json` configuration file with absolute paths
   - ✅ Validate the complete installation

4. **Provide configuration values** when prompted:
   - API keys for your APIC instance
   - Base URLs for APIC services
   - Other service-specific settings
   - Bob will guide you through each required value

5. **Restart Bob** to load the newly configured MCP servers

6. **Verify installation**:
   - All servers should appear in Bob's MCP server list
   - Configuration file created at `.bob/mcp.json` in your workspace
   - Server packages located at `~/apic-mcp/servers/`

#### Directory Structure Created

The automated setup creates a standardized, reproducible structure:

```
~/apic-mcp/                          # Root installation directory
├── servers/                         # All MCP server packages
│   ├── apic-analytics-mcp-server/
│   │   ├── mcp.bob.json
│   │   └── apic-analytics-mcp-server-0.0.1.tgz
│   ├── apic-governance-mcp-server/
│   │   ├── mcp.bob.json
│   │   └── apic-governance-mcp-server-0.0.1.tgz
│   ├── apic-management-mcp-server/
│   │   ├── mcp.bob.json
│   │   └── apic-management-mcp-server-0.0.1.tgz
│   └── apic-ai-gateway-mcp-server/
│       ├── mcp.bob.json
│       └── apic-ai-gateway-mcp-server-0.0.1.tgz
└── .git/                            # Repository metadata

.bob/                                # Workspace configuration
└── mcp.json                         # Generated MCP configuration
```

#### Manual Configuration (Alternative)

If you prefer manual setup or need to troubleshoot:

1. **Choose the template file** [`mcp.bob.json`](./analytics/mcp.bob.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.bob` folder
4. **Follow the official Bob setup guide**:
   - Open [`IBM BOB MCP server setup`](https://www.ibm.com/think/tutorials/mcp-integration-ibm-bob)
   - Follow the manual configuration instructions

#### Troubleshooting Bob Setup

**Command not found (`/init-apic-mcp`)**:

- Ensure you're using a Bob version that supports custom commands
- Verify the command file exists in Bob's commands directory
- Try restarting Bob to refresh available commands

**Installation fails**:

- Check prerequisites: Git, Node.js v18+, npm must be installed
- Verify network connectivity to GitHub
- Review Bob's logs for specific error messages
- Try manual configuration as a fallback

**Servers don't appear after installation**:

- Restart Bob completely (not just reload)
- Verify `.bob/mcp.json` exists and contains valid JSON
- Check that all `.tgz` files exist at the paths specified in the configuration
- Review the [detailed installation guide](init-apic-mcp.md) for validation steps

**Configuration updates**:

- To update server configurations, re-run `/init-apic-mcp`
- Existing configurations will be preserved unless you choose to overwrite
- You can also manually edit `.bob/mcp.json`

For comprehensive installation instructions, error handling, and troubleshooting, see the [detailed Bob command documentation](init-apic-mcp.md).

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
|Management|[API Connect Management tools doc](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=tools-api-connect-task)|

More to come soon...
