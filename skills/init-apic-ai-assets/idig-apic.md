---
name: idig-apic
description: Install and configure IBM API Connect MCP servers (analytics, governance, management, management-ai, studio, connection-composer, consumer, idig)
---

Install and configure the IBM API Connect MCP servers from the official GitHub repository. The user chooses which servers to install — only those service folders are fetched from the repository.

## Servers Available

| Server package | Folder in repo |
|---|---|
| `apic-analytics-mcp-server` | `analytics` |
| `apic-governance-mcp-server` | `governance` |
| `apic-management-mcp-server` | `management` |
| `apic-management-ai-mcp-server` | `management-ai` |
| `apic-studio-mcp-server` | `studio` |
| `apic-connection-composer-mcp-server` | `connection-composer` |
| `apic-consumer-mcp-server` | `consumer` |
| `idig-mcp-server` | `idig` |

## Prerequisites Verification

Before starting, verify the following are met:

1. **Git ≥ 2.25**:
   ```bash
   git --version
   ```
   Sparse-checkout cone mode requires Git 2.25 or later. If the version is older, provide platform-specific upgrade instructions and wait for the user to upgrade before continuing.
   - macOS: `brew install git` or https://git-scm.com/
   - Linux: `sudo apt-get install git` or `sudo yum install git`
   - Windows: https://git-scm.com/download/win

2. **Node.js ≥ 20 and npm**:
   ```bash
   node --version
   npm --version
   ```
   Download from https://nodejs.org/ if not present.

3. **Disk space**: At least 500 MB free.

4. **Network**: Access to `github.com`.

**Validation Checkpoint**: All prerequisites must pass before proceeding.

## Installation Workflow

### Step 1: Create Installation Directory

```bash
# macOS/Linux
mkdir -p ~/apic-mcp

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\apic-mcp"
```

### Step 2: Detect Existing Installation and Present Server Selection

Before cloning anything, check whether `~/apic-mcp` already exists as a git repository and which service folders are already present on disk. This determines which servers are pre-checked in the selection UI and which git operation to run later.

#### Detection Logic

```bash
# macOS/Linux — check if it is already a git repo
git -C ~/apic-mcp rev-parse --git-dir 2>/dev/null && echo "IS_GIT_REPO" || echo "NOT_GIT_REPO"

# macOS/Linux — if it is a git repo, list already-present service folders
for folder in analytics governance management management-ai studio connection-composer consumer idig; do
  [ -d ~/apic-mcp/$folder ] && echo "PRESENT: $folder"
done

# Windows (PowerShell)
try { git -C "$env:USERPROFILE\apic-mcp" rev-parse --git-dir 2>$null; $isRepo = $true } catch { $isRepo = $false }
foreach ($folder in @("analytics","governance","management","management-ai","studio","connection-composer","consumer","idig")) {
  if (Test-Path "$env:USERPROFILE\apic-mcp\$folder") { Write-Host "PRESENT: $folder" }
}
```

Record:
- `EXISTING_REPO`: boolean — whether `~/apic-mcp` is already a git repo.
- `ALREADY_INSTALLED`: list of service folder names already present on disk.

#### Present Server Selection Checklist

Pre-check servers whose folders are already on disk. Label them `[installed]` so the user can see what is there. The user can add more servers to the selection; they should not need to re-select already-installed ones (but it is harmless if they do — the sparse-checkout add is idempotent).

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Available IBM API Connect MCP Servers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the servers you want to configure.
Servers marked [installed] are already present in ~/apic-mcp.

[x] apic-analytics-mcp-server          [installed]
    Analytics tools for API usage, latency, and status monitoring

[ ] apic-governance-mcp-server
    Governance tools for API validation and rule management

[ ] apic-management-mcp-server
    Management tools for APIs, products, catalogs, and subscriptions

[ ] apic-management-ai-mcp-server
    AI-powered tools for OpenAPI generation and enhancement

[ ] apic-studio-mcp-server
    API Studio design and publishing tools

[ ] apic-connection-composer-mcp-server
    Tools for composing and chaining MCP server connections

[ ] apic-consumer-mcp-server
    Consumer-facing tools for API discovery and subscription

[ ] idig-mcp-server
    AI Gateway tools for LLM provider management and REST-to-MCP conversion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Select at least one server to continue.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Rules**:
- User must select at least one server. Only selected servers will be cloned and configured.
- Servers not selected will not be fetched from the repository.
- Record the final selection as `SELECTED_SERVERS` (list of server package names) and `SELECTED_FOLDERS` (list of corresponding service folder names).

### Step 3: Clone or Update Repository (Sparse)

The repository is cloned using **blobless sparse checkout** so that only the selected service folders — plus a small set of common top-level files — are materialised on disk. The user will never need to run git commands in `~/apic-mcp` manually.

**Common top-level paths always included** (regardless of server selection):

```
README.md
skills/
svg/
```

**Compute the full sparse path list** by combining the common paths with the selected service folders, e.g. for `analytics` and `idig`:

```
README.md  skills/  svg/  analytics/  idig/
```

#### First Run — `~/apic-mcp` is not yet a git repo

```bash
# macOS/Linux
# Step A: blobless clone — fetches tree metadata only, no file content yet
git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git ~/apic-mcp

# Step B: enable sparse checkout in cone mode
git -C ~/apic-mcp sparse-checkout init --cone

# Step C: set the paths to materialise (common files + selected service folders)
git -C ~/apic-mcp sparse-checkout set README.md skills/ svg/ <folder-1>/ <folder-2>/

# Step D: check out — only the sparse paths are downloaded and written to disk
git -C ~/apic-mcp checkout main
```

```powershell
# Windows (PowerShell)
git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git "$env:USERPROFILE\apic-mcp"
git -C "$env:USERPROFILE\apic-mcp" sparse-checkout init --cone
git -C "$env:USERPROFILE\apic-mcp" sparse-checkout set README.md skills/ svg/ <folder-1>/ <folder-2>/
git -C "$env:USERPROFILE\apic-mcp" checkout main
```

#### Re-run — `~/apic-mcp` is already a git repo

Add the newly selected service folders to the existing sparse-checkout set (already-installed folders stay untouched), then pull the latest content:

```bash
# macOS/Linux

# Step A: determine which folders are *new* (selected but not yet present on disk)
NEW_FOLDERS=(<folder-for-each-newly-selected-server>)

# Step B: add new folders to the sparse-checkout set (idempotent — safe to re-add existing ones)
git -C ~/apic-mcp sparse-checkout add "${NEW_FOLDERS[@]}"

# Step C: pull latest content for all sparse paths
git -C ~/apic-mcp pull origin main
```

```powershell
# Windows (PowerShell)
$newFolders = @("<folder-1>", "<folder-2>")
git -C "$env:USERPROFILE\apic-mcp" sparse-checkout add $newFolders
git -C "$env:USERPROFILE\apic-mcp" pull origin main
```

**Full-clone fallback**: If `~/apic-mcp` is a git repo but has no sparse-checkout configuration (i.e. `git -C ~/apic-mcp sparse-checkout list` returns nothing), it was previously cloned in full. All folders are already present — just run `git -C ~/apic-mcp pull origin main` and skip the sparse-checkout steps.

**Clone failure handling**: If the clone fails (network error), retry up to 3 times with 5-second delays. If `~/apic-mcp` exists but is not a git repo, offer the user:
- [A] Backup and clear the directory, then re-clone
- [B] Choose a different installation directory
- [C] Cancel

**Validation Checkpoint**: After this step, confirm each selected service folder exists inside `~/apic-mcp/` and contains a `mcp.bob.json` and a `*.tgz` file.

### Step 4: Create Workspace Configuration Directory

```bash
# All platforms (run from workspace root)
mkdir -p .bob
```

### Step 5: Initialize MCP Configuration File

Check if `.bob/mcp.json` exists. If not, create it:

```bash
# macOS/Linux
[ ! -f .bob/mcp.json ] && echo '{"mcpServers":{}}' > .bob/mcp.json

# Windows (PowerShell)
if (-not (Test-Path ".bob\mcp.json")) {
  '{"mcpServers":{}}' | Out-File -FilePath ".bob\mcp.json" -Encoding utf8
}
```

### Step 6: Install API Studio CLI and Agent Skills

#### API Studio CLI (`idig-mcp-server` only)

If `idig-mcp-server` is among the selected servers, run:

```bash
# All platforms
npm i -g @apistudio/apim-cli@latest
```

NOTE: The `bin` command to invoke the APIM CLI package is `apic`

Also install the API Studio build-project skill for Bob:

```bash
# All platforms
npx -y skills add -y https://github.com/ibm-apiconnect/api-studio-skills/tree/develop --skill api-studio-build-project -a bob -a github-copilot
```

If either command fails:
- Retry once.
- If still failing, continue with MCP configuration and include the failure and manual retry commands in the final report.

#### Bundled Agent Skills

For each selected server, check whether its service folder contains a `skills/` subdirectory. If it does, install every skill found inside it.

```bash
# macOS/Linux — list skill folders for a server (example: idig)
ls ~/apic-mcp/<service-folder>/skills/

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\apic-mcp\<service-folder>\skills\"
```

For each skill folder found, run:

```bash
# macOS/Linux
npx -y skills add -y ~/apic-mcp/<service-folder>/skills/<skill-folder> -a bob -a github-copilot

# Windows (PowerShell)
npx -y skills add -y "$env:USERPROFILE\apic-mcp\<service-folder>\skills\<skill-folder>" -a bob -a github-copilot
```

**Rules**:
- Only check servers the user has selected.
- If a server's folder has no `skills/` subdirectory, skip it silently.
- If a skill install fails, retry once. On continued failure, include the manual command in the final report and continue.

### Step 7: Parse Server Configurations

For each selected server, read its `mcp.bob.json` from the cloned repo:

```
~/apic-mcp/<service-folder>/mcp.bob.json
```

Service folder mapping:

| Server | Folder |
|---|---|
| `apic-analytics-mcp-server` | `analytics` |
| `apic-governance-mcp-server` | `governance` |
| `apic-management-mcp-server` | `management` |
| `apic-management-ai-mcp-server` | `management-ai` |
| `apic-studio-mcp-server` | `studio` |
| `apic-connection-composer-mcp-server` | `connection-composer` |
| `apic-consumer-mcp-server` | `consumer` |
| `idig-mcp-server` | `idig` |

Identify all `<placeholder>` values in each file. All servers in this group share the same set of credentials:

| Environment variable | Description | Required |
|---|---|---|
| `API_KEY` | API key for your API Connect instance | ✅ |
| `client_id` | Client ID configured on your API Connect instance | ✅ |
| `client_secret` | Client secret configured on your API Connect instance | ✅ |
| `PROVIDER_ORG` | Provider organization name | ✅ |
| `APIC_PLATFORM_URL` | Platform endpoint URL | ✅ |
| `APIC_MANAGEMENT_URL` | Management endpoint URL | ✅ |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` to disable cert validation (self-signed certs), `1` to enable | optional, default `1` |

**Validation Checkpoint**: All selected `mcp.bob.json` files are valid JSON and parseable.

### Step 8: Choose Configuration Mode

Ask the user how they want to provide configuration values:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Configuration Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have selected N servers. All share the same API Connect credentials.

[1] Configure servers individually
    — Provide values for each server one at a time
    — Recommended if servers use different credentials

[2] Configure all servers at once (recommended)
    — Provide the shared credential values once
    — Applied to all selected servers automatically

Enter your choice [1 or 2]:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 9: Collect Configuration Values

**IMPORTANT**: Ask for each value **ONE AT A TIME**. Wait for the user to respond before asking the next. Never ask for all values at once or request JSON.

#### Mode 2 (recommended) — Shared values across all servers

Since all selected servers use the same credentials, ask once:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Connect Credentials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These values will be applied to all N selected servers.

APIC_PLATFORM_URL (required):
Enter your API Connect platform URL (e.g. https://platform.example.com): _

[wait for response]

APIC_MANAGEMENT_URL (required):
Enter your API Connect management URL (e.g. https://manager.example.com): _

[wait for response]

PROVIDER_ORG (required):
Enter your provider organization name: _

[wait for response]

API_KEY (required):
Enter your API key: _

[wait for response]

client_id (required):
Enter your client ID: _

[wait for response]

client_secret (required):
Enter your client secret: _

[wait for response]

NODE_TLS_REJECT_UNAUTHORIZED (optional, default: 1):
Enter 0 to disable certificate validation or press Enter to keep the default (1): _

[wait for response]

✓ All credential values collected.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Mode 1 — Individual server configuration

For each selected server in turn, ask for the same credential set above, labelling the server number clearly (e.g. `[1/3] Configuring: apic-analytics-mcp-server`).

**Critical Rules**:
- ❌ DO NOT ask for multiple values in a single prompt
- ❌ DO NOT ask the user to provide JSON or structured data
- ✅ DO ask ONE value at a time
- ✅ DO wait for user response after each prompt
- ✅ DO validate each value before moving on (URLs must start with `http://` or `https://`, strings must be non-empty)
- ✅ DO show defaults for optional fields

**Validation Checkpoint**: All required values collected for every selected server before proceeding.

### Step 10: Generate Absolute Paths

Resolve the installation directory to an absolute path:

```bash
# macOS/Linux
INSTALL_DIR=$(cd ~/apic-mcp && pwd)

# Windows (PowerShell)
$INSTALL_DIR = (Resolve-Path "$env:USERPROFILE\apic-mcp").Path
```

For each selected server, the `.tgz` path is:

```
${INSTALL_DIR}/<service-folder>/<server-package>-<version>.tgz
```

Examples:
- `/Users/alice/apic-mcp/analytics/apic-analytics-mcp-server-0.0.1.tgz`
- `/Users/alice/apic-mcp/idig/idig-mcp-server-0.0.1.tgz`

**Validation Checkpoint**: Every `.tgz` file for the selected servers exists at the constructed path.

### Step 11: Update `.bob/mcp.json`

Merge the selected servers into the existing configuration:

1. Read and parse the existing `.bob/mcp.json`.
2. For each selected server, populate its block from the `mcp.bob.json` template, replacing placeholders with user values and the absolute `.tgz` path.
3. Preserve any existing server entries already in the file.
4. Write the result with 2-space indentation.

**Example output** (one server shown):

```json
{
  "mcpServers": {
    "apic-analytics-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "-p",
        "/Users/alice/apic-mcp/analytics/apic-analytics-mcp-server-0.0.1.tgz",
        "apic-analytics-mcp-server"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "1",
        "PROVIDER_ORG": "my-org",
        "API_KEY": "••••••••",
        "client_id": "my-client-id",
        "client_secret": "••••••••",
        "APIC_PLATFORM_URL": "https://platform.example.com",
        "APIC_MANAGEMENT_URL": "https://manager.example.com"
      }
    }
  }
}
```

**Validation Checkpoint**: Validate the final JSON:

```bash
# macOS/Linux
cat .bob/mcp.json | python -m json.tool > /dev/null && echo "Valid JSON"

# Windows (PowerShell)
try { Get-Content .bob\mcp.json | ConvertFrom-Json; Write-Host "Valid JSON" } catch { Write-Host "Invalid JSON" }
```

### Step 12: Verify Installation

Check that every selected server is correctly set up:

1. ✓ `.tgz` file exists at the configured path
2. ✓ No `<placeholder>` values remain in `.bob/mcp.json`
3. ✓ `.bob/mcp.json` is valid JSON
4. ✓ If `idig-mcp-server` was selected: `apic` CLI is available (`apic --version`)

### Step 13: Report Installation Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IBM API Connect MCP Server Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Installation Directory : ~/apic-mcp
Configuration File     : .bob/mcp.json

Configured Servers (N of 8 available):
  ✓ <server-1>
  ✓ <server-2>
  ...

Skipped (not selected):
  - <server-N>
  ...

[If idig-mcp-server was selected:]
Additional Dependencies:
  ✓ @apistudio/apim-cli installed globally
  ✓ api-studio-build-project skill added for bob and github-copilot agents

[For each bundled skill installed from any selected server:]
  ✓ <skill-name> skill added for bob and github-copilot agents

Next Steps:
  1. Restart Bob (or your IDE) to load the new MCP servers
  2. Verify servers appear in Bob's MCP server list
  3. Documentation: https://github.com/ibm-apiconnect/apic-mcp-server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Rules

1. **Absolute paths**: Always resolve `~` to the full home directory path before writing to `mcp.json`.
2. **Preserve existing config**: Never overwrite existing server entries in `.bob/mcp.json` without asking the user first.
3. **Secrets**: Never echo or log `API_KEY`, `client_secret`, or any sensitive values.
4. **One value at a time**: All prompts for configuration values must be issued one at a time.
5. **Execution order**: Server selection (Step 2) must happen before the clone (Step 3) so only the needed folders are fetched.
6. **No manual git**: The user will never run git commands in `~/apic-mcp`. All git operations are performed by the agent on the user's behalf.

## Error Handling

### Git Not Installed or Too Old
Provide platform-specific install/upgrade instructions, wait for the user to complete them, then re-verify.

### Repository Clone Failure
If the blobless sparse clone fails, retry up to 3 times with 5-second delays. If it continues to fail, retry once without `--filter=blob:none` (full clone of selected sparse paths). If `~/apic-mcp` exists but is not a git repo, offer backup/relocate/cancel.

### Network Connectivity Issues
Retry up to 3 times with back-off. Offer manual download as fallback.

### Invalid JSON Configuration
Backup the corrupted file, attempt repair (trailing commas, quote fixes). If repair fails, recreate from `{"mcpServers":{}}` and re-apply user values.

### Missing `.tgz` File
Run `git -C ~/apic-mcp sparse-checkout add <service-folder>/` followed by `git -C ~/apic-mcp pull origin main`. Verify the service folder name matches the table in Step 7.

### API Studio CLI Installation Failure

**Error**: `npm i -g @apistudio/apim-cli@latest` fails

1. Check npm registry connectivity.
2. Check global prefix is writable: `npm config get prefix`.
3. Retry once. On continued failure, skip and include the manual command in the report:
   ```bash
   npm i -g @apistudio/apim-cli@latest
   ```

### API Studio Skill Installation Failure

**Error**: `npx -y skills add ... --skill api-studio-build-project -a bob` fails

1. Verify network access to `github.com`.
2. Retry once. On continued failure, include the manual command in the report:
   ```bash
   npx -y skills add -y https://github.com/ibm-apiconnect/api-studio-skills/tree/develop --skill api-studio-build-project -a bob -a github-copilot
   ```

### Bundled Skill Installation Failure

**Error**: `npx -y skills add -y ~/apic-mcp/<service-folder>/skills/<skill-folder> ...` fails

1. Verify the skill folder exists at the expected path inside the cloned repository.
2. Retry once. On continued failure, include the manual command in the final report:
   ```bash
   # macOS/Linux
   npx -y skills add -y ~/apic-mcp/<service-folder>/skills/<skill-folder> -a bob -a github-copilot

   # Windows (PowerShell)
   npx -y skills add -y "$env:USERPROFILE\apic-mcp\<service-folder>\skills\<skill-folder>" -a bob -a github-copilot
   ```

### Permission Denied
Suggest a different installation directory or check write permissions on the target path.

## Maintenance

### Adding More Servers Later

Re-run this skill. The selection checklist will pre-check already-installed servers. Select any additional servers — the agent will run `git sparse-checkout add` to fetch only the new folders and then `git pull` to materialise them, leaving existing folders untouched.

### Updating

To pull the latest versions of all installed servers:

```bash
# macOS/Linux
git -C ~/apic-mcp pull origin main

# Windows (PowerShell)
git -C "$env:USERPROFILE\apic-mcp" pull origin main
```

Re-run this skill after updating if server packages or config templates have changed.

### Backup Configuration
```bash
# macOS/Linux
cp .bob/mcp.json .bob/mcp.json.backup

# Windows (PowerShell)
Copy-Item .bob\mcp.json .bob\mcp.json.backup
```

### Uninstall
```bash
# macOS/Linux
rm -rf ~/apic-mcp && rm -f .bob/mcp.json

# Windows (PowerShell)
Remove-Item -Path "$env:USERPROFILE\apic-mcp" -Recurse -Force
Remove-Item -Path ".bob\mcp.json" -Force
```
