# apic-mcp-server

> IBM APIC MCP server exposes API Connect capabilities to your MCP clients and AI Agent workflows.

## ![mcp](svg/mcp.icon.badge.svg) Using `apic-mcp-server` with MCP Clients

This MCP server can be integrated with various MCP clients such as **Claude Desktop**, **VS Code**, and **IBM BOB** etc.

## 📰 Blogs

[IBM API Connect MCP Server](https://community.ibm.com/community/user/blogs/goutham-shivanna/2026/01/26/ibm-api-connect-mcp-server)

[Exploring IBM API Connect v12.1.0 API Analytics with the API Agent's Analytics MCP Tool](https://community.ibm.com/community/user/blogs/michael-osullivan/2025/12/23/apic-api-analytics-with-the-api-agent)

### 💻 Suggested MCP Clients

[![IBM BOB](svg/ibm-bob.badge.svg)](https://www.ibm.com/products/bob) [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](https://code.visualstudio.com/) [![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-D97757?logo=claude&logoColor=fff)](https://claude.ai/download)

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

### [![IBM BOB](svg/ibm-bob.icon.svg) `IBM BOB`](https://www.ibm.com/products/bob)

IBM Bob provides two setup methods: an automated skill-based approach (recommended) and manual configuration.

#### Automated Setup (Recommended)

Bob uses a skill called `init-apic-ai-assets` that automates the entire installation and configuration process. Install it with a single command:

```bash
npx -y skills add -y https://github.com/ibm-apiconnect/apic-mcp-server/skills -a bob
```

Once installed, open the chat, ensure in `Agent` mode and type `/` in the chat and select `init-apic-ai-assets` command and hit `enter`:

```txt
/init-apic-ai-assets
```

The skill will automatically:
- ✅ Ask which IBM product you are setting up (IBM API Connect or IDIG standalone)
- ✅ Verify prerequisites (Git, Node.js v20+, npm)
- ✅ Clone the official APIC MCP server repository to `~/apic-mcp/`
- ✅ Install the API Studio CLI (`@apistudio/apim-cli`)
- ✅ Prompt you for required configuration values (API keys, URLs, etc.) **one at a time**
- ✅ Generate the `.bob/mcp.json` configuration file with absolute paths
- ✅ Validate the complete installation

**Restart Bob** after the skill completes to load the newly configured MCP servers.

#### Manual Configuration (Alternative)

If you prefer manual setup or need to troubleshoot:

1. **Choose the template file** [`mcp.bob.json`](./analytics/mcp.bob.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.bob` folder
4. **Install Agent Skills** (Required)

   Clone the repository to get access to bundled skills:

   ```bash
   # macOS/Linux
   git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git ~/apic-mcp
   git -C ~/apic-mcp sparse-checkout init --cone
   git -C ~/apic-mcp sparse-checkout set README.md skills/
   git -C ~/apic-mcp checkout main
   ```

   ```powershell
   # Windows (PowerShell)
   git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git "$env:USERPROFILE\apic-mcp"
   git -C "$env:USERPROFILE\apic-mcp" sparse-checkout init --cone
   git -C "$env:USERPROFILE\apic-mcp" sparse-checkout set README.md skills/
   git -C "$env:USERPROFILE\apic-mcp" checkout main
   ```

   Then install available skills:

   ```bash
   # macOS/Linux
   npx -y skills add -y ~/apic-mcp/skills/init-apic-ai-assets -a bob
   ```

   ```powershell
   # Windows (PowerShell)
   npx -y skills add -y "$env:USERPROFILE\apic-mcp\skills\init-apic-ai-assets" -a bob
   ```

5. **Follow the official Bob setup guide**:
   - Open [`IBM BOB MCP server setup`](https://www.ibm.com/think/tutorials/mcp-integration-ibm-bob)
   - Follow the manual configuration instructions

#### Troubleshooting Bob Setup

**Skill not found (`init-apic-ai-assets`)**:

- Ensure the skill was installed successfully via the `npx -y skills` command above
- Verify you are using a Bob version that supports skills
- Try restarting Bob to refresh available skills

**Installation fails**:

- Check prerequisites: Git, Node.js v20+, npm must be installed
- Verify network connectivity to GitHub
- Review Bob's logs for specific error messages
- Try manual configuration as a fallback

**Servers don't appear after installation**:

- Restart Bob completely (not just reload)
- Verify `.bob/mcp.json` exists and contains valid JSON
- Check that all `.tgz` files exist at the paths specified in the configuration

**Configuration updates**:

- To update server configurations, re-run the `init-apic-ai-assets` skill
- Existing configurations will be preserved unless you choose to overwrite
- You can also manually edit `.bob/mcp.json`

---

### [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/-0078d7.svg?logo=vsc&logoColor=white) `Visual Studio Code`](https://code.visualstudio.com/)

#### Automated Setup (Recommended)

VS Code co-pilot uses a skill called `init-apic-ai-assets` that automates the entire installation and configuration process. Install it with a single command:

```bash
npx -y skills add -y https://github.com/ibm-apiconnect/apic-mcp-server/skills -a github-copilot
```

Once installed, open the chat, ensure in `Agent` mode and type `/` in the chat and select `init-apic-ai-assets` command and hit `enter`:

```txt
/init-apic-ai-assets
```

The skill will automatically:

- ✅ Ask which IBM product you are setting up (IBM API Connect or IDIG standalone)
- ✅ Verify prerequisites (Git, Node.js v20+, npm)
- ✅ Clone the official APIC MCP server repository to `~/apic-mcp/`
- ✅ Install the API Studio CLI (`@apistudio/apim-cli`)
- ✅ Prompt you for required configuration values (API keys, URLs, etc.) **one at a time**
- ✅ Generate the `.vscode/mcp.json` configuration file with absolute paths
- ✅ Validate the complete installation

#### Manual Configuration

1. **Choose the template file** [`mcp.vscode.json`](./analytics/mcp.vscode.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.vscode` folder
4. **Install Agent Skills** (Required)

   Clone the repository to get access to bundled skills:

   ```bash
   # macOS/Linux
   git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git ~/apic-mcp
   git -C ~/apic-mcp sparse-checkout init --cone
   git -C ~/apic-mcp sparse-checkout set README.md skills/
   git -C ~/apic-mcp checkout main
   ```

   ```powershell
   # Windows (PowerShell)
   git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git "$env:USERPROFILE\apic-mcp"
   git -C "$env:USERPROFILE\apic-mcp" sparse-checkout init --cone
   git -C "$env:USERPROFILE\apic-mcp" sparse-checkout set README.md skills/
   git -C "$env:USERPROFILE\apic-mcp" checkout main
   ```

   Then install available skills:

   ```bash
   # macOS/Linux
   npx -y skills add -y ~/apic-mcp/skills/init-apic-ai-assets -a github-copilot
   ```

   ```powershell
   # Windows (PowerShell)
   npx -y skills add -y "$env:USERPROFILE\apic-mcp\skills\init-apic-ai-assets" -a github-copilot
   ```

5. **Follow the official VS Code setup guide**:
   - Open [`VS Code MCP server setup`](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server)
   - Expand the section **`Add an MCP server to your workspace`** for detailed instructions

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
