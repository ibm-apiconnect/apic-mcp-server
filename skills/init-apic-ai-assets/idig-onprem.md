---
name: idig-onprem
description: Install and configure the IBM DataPower Interactive Gateway on-premises MCP server (idig-onprem-mcp-server)
---

Install and configure the `idig-onprem-mcp-server` for a standalone IBM DataPower Interactive Gateway deployment.

## Server Installed

| Server package | Folder in repo |
|---|---|
| `idig-onprem-mcp-server` | `idig-onprem` |

**Required credentials** (no IBM API Connect instance needed):

| Environment variable | Description |
|---|---|
| `STANDALONE_URL` | Base URL of your standalone IDIG instance (e.g. `https://gateway.example.com`) |
| `STANDALONE_USERNAME` | Username for authentication |
| `STANDALONE_PASSWORD` | Password for authentication |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` to disable cert validation (self-signed certs), `1` to enable (default `1`) |

## Prerequisites Verification

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

3. **Disk space**: At least 200 MB free.

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

### Step 2: Clone or Update Repository (Sparse)

The repository is cloned using **blobless sparse checkout** so that only the `idig-onprem/` service folder — plus a small set of common top-level files — is materialised on disk. The user will never need to run git commands in `~/apic-mcp` manually.

**Paths always included**:

```
README.md
skills/
svg/
idig-onprem/
```

#### First Run — `~/apic-mcp` is not yet a git repo

Check whether `~/apic-mcp` is already a git repository:

```bash
# macOS/Linux
git -C ~/apic-mcp rev-parse --git-dir 2>/dev/null && echo "IS_GIT_REPO" || echo "NOT_GIT_REPO"

# Windows (PowerShell)
try { git -C "$env:USERPROFILE\apic-mcp" rev-parse --git-dir 2>$null; Write-Host "IS_GIT_REPO" } catch { Write-Host "NOT_GIT_REPO" }
```

If it is **not** a git repo, run a blobless sparse clone:

```bash
# macOS/Linux
# Step A: blobless clone — fetches tree metadata only, no file content yet
git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git ~/apic-mcp

# Step B: enable sparse checkout in cone mode
git -C ~/apic-mcp sparse-checkout init --cone

# Step C: set the paths to materialise
git -C ~/apic-mcp sparse-checkout set README.md skills/ svg/ idig-onprem/

# Step D: check out — only the sparse paths are downloaded and written to disk
git -C ~/apic-mcp checkout main
```

```powershell
# Windows (PowerShell)
git clone --filter=blob:none --no-checkout https://github.com/ibm-apiconnect/apic-mcp-server.git "$env:USERPROFILE\apic-mcp"
git -C "$env:USERPROFILE\apic-mcp" sparse-checkout init --cone
git -C "$env:USERPROFILE\apic-mcp" sparse-checkout set README.md skills/ svg/ idig-onprem/
git -C "$env:USERPROFILE\apic-mcp" checkout main
```

#### Re-run — `~/apic-mcp` is already a git repo

If the repo is already present (re-running this skill to update or reconfigure), pull the latest content. The sparse-checkout set already includes `idig-onprem/` so no changes to it are needed:

```bash
# macOS/Linux
git -C ~/apic-mcp pull origin main

# Windows (PowerShell)
git -C "$env:USERPROFILE\apic-mcp" pull origin main
```

**Full-clone fallback**: If `~/apic-mcp` is a git repo but `git -C ~/apic-mcp sparse-checkout list` returns nothing, it was previously cloned in full. All folders are already present — just run `git -C ~/apic-mcp pull origin main`.

**Clone failure handling**: If the clone fails (network error), retry up to 3 times with 5-second delays. If it continues to fail, retry once without `--filter=blob:none`. If `~/apic-mcp` exists but is not a git repo, offer the user:
- [A] Backup and clear the directory, then re-clone
- [B] Choose a different installation directory
- [C] Cancel

**Validation Checkpoint**: After this step, confirm the `idig-onprem/` folder exists inside `~/apic-mcp/` and contains a `mcp.bob.json` and a `*.tgz` file.

### Step 3: Create Workspace Configuration Directory

```bash
# All platforms (run from workspace root)
mkdir -p .bob
```

### Step 4: Initialize MCP Configuration File

Check if `.bob/mcp.json` exists. If not, create it:

```bash
# macOS/Linux
[ ! -f .bob/mcp.json ] && echo '{"mcpServers":{}}' > .bob/mcp.json

# Windows (PowerShell)
if (-not (Test-Path ".bob\mcp.json")) {
  '{"mcpServers":{}}' | Out-File -FilePath ".bob\mcp.json" -Encoding utf8
}
```

### Step 5: Install API Studio CLI and Agent Skills

#### API Studio CLI

Install the API Studio CLI globally:

```bash
# All platforms
npm i -g @apistudio/apim-cli@latest
```

NOTE: The `bin` command to invoke the APIM CLI is `apic`

Also install the API Studio build-project skill:

```bash
# For bobide
npx -y skills add -y https://github.com/ibm-apiconnect/api-studio-skills/tree/develop --skill api-studio-build-project --skill api-studio-project-manager -a bob
```

For GitHub Co-pilot:

```bash
# For GitHub co-pilot
npx -y skills add -y https://github.com/ibm-apiconnect/api-studio-skills/tree/develop --skill api-studio-build-project --skill api-studio-project-manager -a github-copilot
```

If either command fails:
- Retry once.
- If still failing, continue with MCP configuration and include the failure and manual retry commands in the final report.

#### Bundled Agent Skills

Check whether the cloned repository's `idig-onprem/` folder contains a `skills/` subdirectory. If it does, install every skill found inside it.

```bash
# macOS/Linux — list skill folders
ls ~/apic-mcp/idig-onprem/skills/

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\apic-mcp\idig-onprem\skills\"
```

For each skill folder found, run:

```bash
# macOS/Linux
npx -y skills add -y ~/apic-mcp/idig-onprem/skills/<skill-folder> -a <agent (bob or github-copilot)>

# Windows (PowerShell)
npx -y skills add -y "$env:USERPROFILE\apic-mcp\idig-onprem\skills\<skill-folder>" -a <agent (bob or github-copilot)>
```

**Rules**:
- If the `skills/` folder is absent, skip this step silently.
- If a skill install fails, retry once. On continued failure, include the manual command in the final report and continue.

### Step 6: Collect Configuration Values

**IMPORTANT**: Ask for each value **ONE AT A TIME**. Wait for the user to respond before asking the next. Never ask for all values at once or request JSON.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDIG On-Premises Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STANDALONE_URL (required):
Enter your IDIG base URL (e.g. https://gateway.example.com): _

[wait for response]

STANDALONE_USERNAME (required):
Enter your IDIG username: _

[wait for response]

STANDALONE_PASSWORD (required):
Enter your IDIG password: _

[wait for response]

NODE_TLS_REJECT_UNAUTHORIZED (optional, default: 1):
Enter 0 to disable certificate validation or press Enter to keep the default (1): _

[wait for response]

✓ Configuration values collected.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Critical Rules**:
- ❌ DO NOT ask for multiple values in a single prompt
- ❌ DO NOT ask the user to provide JSON or structured data
- ✅ DO ask ONE value at a time
- ✅ DO wait for user response after each prompt
- ✅ DO validate URLs (must start with `http://` or `https://`) and non-empty strings
- ✅ DO show defaults for optional fields
- ✅ DO NOT log or echo the password value

**Validation Checkpoint**: All required values collected before proceeding.

### Step 7: Generate Absolute Path

Resolve the installation directory to an absolute path:

```bash
# macOS/Linux
INSTALL_DIR=$(cd ~/apic-mcp && pwd)

# Windows (PowerShell)
$INSTALL_DIR = (Resolve-Path "$env:USERPROFILE\apic-mcp").Path
```

The `.tgz` path for the server is:

```
${INSTALL_DIR}/idig-onprem/idig-onprem-mcp-server-<version>.tgz
```

Example: `/Users/alice/apic-mcp/idig-onprem/idig-onprem-mcp-server-0.0.1.tgz`

**Validation Checkpoint**: The `.tgz` file exists at the constructed path.

### Step 8: Update `.bob/mcp.json`

Read and parse the existing `.bob/mcp.json`, then add the `idig-onprem-mcp-server` entry, replacing all placeholders with the user-provided values and the absolute `.tgz` path. Preserve any existing entries. Write with 2-space indentation.

**Example output**:

```json
{
  "mcpServers": {
    "idig-onprem-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "-p",
        "/Users/alice/apic-mcp/idig-onprem/idig-onprem-mcp-server-0.0.1.tgz",
        "idig-onprem-mcp-server"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "1",
        "STANDALONE_URL": "https://gateway.example.com",
        "STANDALONE_USERNAME": "alice",
        "STANDALONE_PASSWORD": "••••••••"
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

### Step 9: Verify Installation

1. ✓ `.tgz` file exists at the configured path
2. ✓ No `<placeholder>` values remain in `.bob/mcp.json`
3. ✓ `.bob/mcp.json` is valid JSON
4. ✓ `apic` CLI is available: `apic --version`

### Step 10: Report Installation Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDIG On-Premises MCP Server Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Installation Directory : ~/apic-mcp
Configuration File     : .bob/mcp.json

Configured Server:
  ✓ idig-onprem-mcp-server

Additional Dependencies:
  ✓ @apistudio/apim-cli installed globally
  ✓ api-studio-build-project skill added for bob and github-copilot agents
  ✓ api-studio-project-manager skill added for bob and github-copilot agents

[For each bundled skill installed:]
  ✓ <skill-name> skill added for bob and github-copilot agents

Next Steps:
  1. Restart Bob (or your IDE) to load the new MCP server
  2. Verify the server appears in Bob's MCP server list
  3. Documentation: https://github.com/ibm-apiconnect/apic-mcp-server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Rules

1. **Absolute paths**: Always resolve `~` to the full home directory path before writing to `mcp.json`.
2. **Preserve existing config**: Never overwrite existing server entries in `.bob/mcp.json` without asking the user first.
3. **Secrets**: Never echo or log `STANDALONE_PASSWORD` or any sensitive values.
4. **One value at a time**: All prompts for configuration values must be issued one at a time.
5. **Execution order**: Complete Steps 5 (API Studio CLI + skill) before collecting configuration values in Step 6.
6. **No manual git**: The user will never run git commands in `~/apic-mcp`. All git operations are performed by the agent on the user's behalf.

## Error Handling

### Git Not Installed or Too Old
Provide platform-specific install/upgrade instructions, wait for the user to complete them, then re-verify.

### Repository Clone Failure
If the blobless sparse clone fails, retry up to 3 times with 5-second delays. If it continues to fail, retry once without `--filter=blob:none`. If `~/apic-mcp` exists but is not a git repo, offer backup/relocate/cancel.

### Network Connectivity Issues
Retry up to 3 times with back-off. Offer manual download as fallback.

### Invalid JSON Configuration
Backup the corrupted file, attempt repair (trailing commas, quote fixes). If repair fails, recreate from `{"mcpServers":{}}` and re-apply user values.

### Missing `.tgz` File
Run `git -C ~/apic-mcp sparse-checkout add idig-onprem/` followed by `git -C ~/apic-mcp pull origin main`. Verify the `idig-onprem/` folder exists and contains the `.tgz` file.

### API Studio CLI Installation Failure

**Error**: `npm i -g @apistudio/apim-cli@latest` fails

1. Check npm registry connectivity.
2. Check global prefix is writable: `npm config get prefix`.
3. Retry once. On continued failure, skip and include the manual command in the report:
   ```bash
   npm i -g @apistudio/apim-cli@latest
   ```

### API Studio Skill Installation Failure

**Error**: `npx -y skills add ... --skill api-studio-build-project --skill api-studio-project-manager` fails

1. Verify network access to `github.com`.
2. Retry once. On continued failure, include the manual command in the report:
   ```bash
   npx -y skills add -y https://github.com/ibm-apiconnect/api-studio-skills/tree/develop --skill api-studio-build-project --skill api-studio-project-manager -a <agent (bob or github-copilot)>
   ```

### Bundled Skill Installation Failure

**Error**: `npx -y skills add -y ~/apic-mcp/idig-onprem/skills/<skill-folder> ...` fails

1. Verify the skill folder exists at the expected path inside the cloned repository.
2. Retry once. On continued failure, include the manual command in the final report:
   ```bash
   # macOS/Linux
   npx -y skills add -y ~/apic-mcp/idig-onprem/skills/<skill-folder> -a <agent (bob or github-copilot)>

   # Windows (PowerShell)
   npx -y skills add -y "$env:USERPROFILE\apic-mcp\idig-onprem\skills\<skill-folder>" -a <agent (bob or github-copilot)>
   ```

### Permission Denied
Suggest a different installation directory or check write permissions on the target path.

## Maintenance

### Updating

To pull the latest version of the installed server:

```bash
# macOS/Linux
git -C ~/apic-mcp pull origin main

# Windows (PowerShell)
git -C "$env:USERPROFILE\apic-mcp" pull origin main
```

Re-run this skill after updating if the server package or config template has changed.

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
