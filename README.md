# apic-mcp-server

> IBM APIC MCP server exposes API Connect capabilities to your MCP clients and AI Agent workflows.

## ![mcp](svg/mcp.icon.badge.svg) Using `apic-mcp-server` with MCP Clients

This MCP server can be integrated with various MCP clients such as **Claude Desktop**, **VS Code**, and **IBM BOB** etc.

## 📰 Blogs

[IBM API Connect MCP Server](https://community.ibm.com/community/user/blogs/goutham-shivanna/2026/01/26/ibm-api-connect-mcp-server)

[Exploring IBM API Connect v12.1.0 API Analytics with the API Agent's Analytics MCP Tool](https://community.ibm.com/community/user/blogs/michael-osullivan/2025/12/23/apic-api-analytics-with-the-api-agent)

---

## 🔀 Which package do I need?

| I'm running… | Package to use |
|---|---|
| **API Connect v10** | [`apic-v10-mcp-server`](./v10_build) — one server, all tools |
| **API Connect v12** | Per-service packages: [Analytics](./analytics_build), [Management](./management_build), [Governance](./governance_build), and more |

> **API Connect v10 users:** there is a single MCP server build that covers all available tools. You do not need to install multiple service packages — just install `apic-v10-mcp-server` and you're done.

---

## 📦 API Connect v10 Setup

### ✅ Prerequisites

- An existing API Connect **v10** instance (on-prem or SaaS)
  - Your _`provider organization`_ name
  - _`API key`_ to connect to your API Connect instance
  - _`Client ID`_ configured on your API Connect instance
  - _`Client Secret`_ configured on your API Connect instance
  - _`APIC Platform URL`_ of your instance
  - _`APIC Management URL`_ of your instance
- The `apic-v10-mcp-server` package — one of:
  - _`.tgz`_ npm archive: `apic-v10-mcp-server-x.x.x.tgz`
  - _`.mcpb`_ Claude extension: `apic-v10-mcp-server-x.x.x.mcpb`
- One of the [suggested MCP clients](#-suggested-mcp-clients) below

### 🛠️ Available Tools (v10)

The `apic-v10-mcp-server` exposes the following tools:

**Analytics** — `GetAnalyticsStatus`, `GetAnalyticsUsage`, `GetAnalyticsLatency`, `GetAnalyticsUsers`, `GetAnalyticsConsumer`, `GetAnalyticsApplication`

**Governance** — `ValidateOpenAPI`, `ValidateProduct`, `ValidateWithRulesets`, `RuleRemediation`, `GetAllRulesets`, `GetRulesFromRuleset`, `CreateRulesetWithRule`, `GovernanceRulesetCreator`, `GovernanceRulesetUpdater`, `SpectralRuleValidator`

**Management** — `ListCatalogs`, `ListSpaces`, `ListPublishedApis`, `ListPublishedProducts`, `ListPlans`, `ListConsumerOrgs`, `ListConsumerApps`, `ListConsumerAppCredentials`, `CreateConsumerApp`, `ListSubscriptionsInConsumerApp`, `ListSubscriptionsInACatalog`, `CreateSubscriptionForPublishedAPI`, `CreateSubscriptionForPublishedProduct`, `ListGatewaysInCatalog`

**GenAI** — `SpectralRuleGenerator`, `OpenAPIGenerator`, `EnhanceOpenAPI`, `ListGatewayPolicies`, `GatewayPolicyGenerator`, `GatewayPolicyModifier`

### 💻 Suggested MCP Clients

[![IBM BOB](svg/ibm-bob.badge.svg)](https://www.ibm.com/products/bob) [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](https://code.visualstudio.com/) [![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-D97757?logo=claude&logoColor=fff)](https://claude.ai/download)

### [![IBM BOB](svg/ibm-bob.icon.svg) IBM BOB — v10 Setup](https://www.ibm.com/products/bob)

1. Locate [`mcp.bob.json`](./v10_build/mcp.bob.json) in the `v10_build` folder.
2. Fill in your configuration values:

   ```json
   {
     "mcpServers": {
       "apic-v10-mcp-server": {
         "command": "npx",
         "args": ["-y", "-p", "<path-to-apic-v10-mcp-server-x.x.x.tgz>", "apic-v10-mcp-server"],
         "env": {
           "NODE_TLS_REJECT_UNAUTHORIZED": "1",
           "PROVIDER_ORG": "<your-provider-organization-name>",
           "API_KEY": "<your-api-key>",
           "client_id": "<your-client-id>",
           "client_secret": "<your-client-secret>",
           "APIC_PLATFORM_URL": "<your-apic-platform-url>",
           "APIC_MANAGEMENT_URL": "<your-apic-management-url>"
         }
       }
     }
   }
   ```

3. Copy the filled file to your workspace `.bob/mcp.json`.
4. Restart Bob to load the new MCP server.

### [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/-0078d7.svg?logo=vsc&logoColor=white) VS Code — v10 Setup](https://code.visualstudio.com/)

1. Locate [`mcp.vscode.json`](./v10_build/mcp.vscode.json) in the `v10_build` folder.
2. Copy it into your workspace `.vscode/mcp.json`.
3. Open VS Code → `⌘+P` / `Ctrl+P` → `>MCP: List Servers` → select `apic-v10-mcp-server` → **Start Server**.
4. VS Code will prompt you for each value (API key, provider org, client ID/secret, URLs) when the server starts.

### [![Claude Desktop](https://img.shields.io/badge/-D97757?logo=claude&logoColor=fff) Claude Desktop — v10 Setup](https://claude.ai/download)

1. Locate `apic-v10-mcp-server-x.x.x.mcpb` in the `v10_build` folder.
2. Double-click the `.mcpb` file — Claude Desktop opens and starts the installation wizard.
3. Enter your API Connect details when prompted.
4. Click **Save / Install**, then **enable** the extension (Claude sets it disabled by default).

---

## 📦 API Connect v12 Setup

For API Connect v12, install the per-service packages you need. See the prerequisites and client setup instructions below.

### ✅ Prerequisites

- Existing API Connect **v12** instance (on-prem or SaaS)
  - Your _`provider organization`_ name
  - _`API key`_ to connect to your API Connect instance
  - _`Client ID`_ and _`Client Secret`_ configured on your instance
  - _`APIC Platform URL`_ and _`APIC Management URL`_ of your instance
- The _`.tgz`_ or _`.mcpb`_ file for each service you want (e.g., `analytics`, `governance`)
- One of the [suggested MCP clients](#-suggested-mcp-clients-1) above

---

## 📄 Debug Logs (all versions)

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

## 📝 Setup Instructions for API Connect v12 (service-based MCP clients)

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

1. **Choose the template file** [`mcp.bob.json`](./analytics_build/mcp.bob.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.bob` folder
4. **Follow the official Bob setup guide**:
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

VS Code Copilot uses a skill called `init-apic-ai-assets` that automates the entire installation and configuration process. Install it with a single command:

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

1. **Choose the template file** [`mcp.vscode.json`](./analytics_build/mcp.vscode.json) from the specific service folder
2. **Fill in your APIC configuration details** in the template
3. **Copy the configured mcp json** to your workspace `.vscode` folder
4. **Follow the official VS Code setup guide**:
   - Open [`VS Code MCP server setup`](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server)
   - Expand the section **`Add an MCP server to your workspace`** for detailed instructions

---

### [![Claude Desktop](https://img.shields.io/badge/-D97757?logo=claude&logoColor=fff) `Claude Desktop`](https://claude.ai/download)

Claude Desktop supports easy installation through Anthropic's **Extensions** feature. We provide a pre-packaged `.mcpb` file for seamless setup.

**No manual configuration needed!** Simply install the `.mcpb` and follow the setup wizard.

#### Step 1: Locate the Extension File

Find the `.mcpb` file from the specific service folder, for example:

```txt
analytics_build/apic-analytics-mcp-server-x.x.x.mcpb
```

where `x.x.x` is the version of the APIC MCP server.

#### Step 2: Install the Extension

1. Double-click the `.mcpb` file
2. Claude Desktop will automatically open and start the installation process

#### Step 3: Complete the Setup

1. A setup wizard will appear asking for your API Connect instance details _(see [prerequisites](#-prerequisites-1))_
2. Click **Save** or **Install**
3. Ensure you **`enable`** the extension — Claude sets it as _`disabled`_ by default

#### Step 4: Start Using

Once installed, the API Connect tools are available in your Claude Desktop conversations.

---

## 🛠️ Available Tools

### API Connect v10

| Category | Tools |
|---|---|
| Analytics | `GetAnalyticsStatus`, `GetAnalyticsUsage`, `GetAnalyticsLatency`, `GetAnalyticsUsers`, `GetAnalyticsConsumer`, `GetAnalyticsApplication` |
| Governance | `ValidateOpenAPI`, `ValidateProduct`, `ValidateWithRulesets`, `RuleRemediation`, `GetAllRulesets`, `GetRulesFromRuleset`, `CreateRulesetWithRule`, `GovernanceRulesetCreator`, `GovernanceRulesetUpdater`, `SpectralRuleValidator` |
| Management | `ListCatalogs`, `ListSpaces`, `ListPublishedApis`, `ListPublishedProducts`, `ListPlans`, `ListConsumerOrgs`, `ListConsumerApps`, `ListConsumerAppCredentials`, `CreateConsumerApp`, `ListSubscriptionsInConsumerApp`, `ListSubscriptionsInACatalog`, `CreateSubscriptionForPublishedAPI`, `CreateSubscriptionForPublishedProduct`, `ListGatewaysInCatalog` |
| GenAI | `SpectralRuleGenerator`, `OpenAPIGenerator`, `EnhanceOpenAPI`, `ListGatewayPolicies`, `GatewayPolicyGenerator`, `GatewayPolicyModifier` |

### API Connect v12

| Service | Docs |
|---|---|
| Analytics | [Analytics tools](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=tools-analytics) |
| Management | [Management tools](https://www.ibm.com/docs/en/api-connect/software/12.1.0?topic=tools-api-connect-task) |

More services coming soon.
