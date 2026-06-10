---
description: Initialize and configure APIC MCP servers from the official GitHub repository
---

Initialize APIC MCP servers by cloning the official repository and configuring them in the workspace.

Required input:

- None (all inputs will be prompted during execution)

Optional input:

- Custom installation directory (defaults to ~/apic-mcp)

## Prerequisites Verification

Before starting the installation process, verify the following prerequisites are met:

1. **Git Installation Check**:
   ```bash
   # macOS/Linux
   git --version

   # Windows (PowerShell)
   git --version
   ```
   - If git is not installed:
     - **macOS**: Install via Homebrew: `brew install git` or download from https://git-scm.com/
     - **Linux**: Use package manager: `sudo apt-get install git` (Debian/Ubuntu) or `sudo yum install git` (RHEL/CentOS)
     - **Windows**: Download from https://git-scm.com/download/win

2. **Node.js and npm Installation Check**:
   ```bash
   # All platforms
   node --version
   npm --version
   ```
   - Required: Node.js version 18.x or higher
   - If not installed, download from https://nodejs.org/

3. **Disk Space Check**:
   - Ensure at least 500MB of free disk space for the installation

4. **Network Connectivity Check**:
   - Verify access to GitHub: `ping github.com` or test in browser
   - Ensure no firewall/proxy blocking git operations

## Directory Structure

The installation follows a standardized directory structure for consistency:

```
~/apic-mcp/                          # Root installation directory
├── servers/                         # All MCP server packages
│   ├── apic-analytics-mcp-server/
│   │   ├── mcp.bob.json
│   │   ├── apic-analytics-mcp-server-0.0.1.tgz
│   │   ├── commands/
│   │   │   └── *.md
│   │   └── skills/
│   ├── apic-governance-mcp-server/
│   │   ├── mcp.bob.json
│   │   ├── apic-governance-mcp-server-0.0.1.tgz
│   │   ├── commands/
│   │   │   └── *.md
│   │   └── skills/
│   ├── apic-management-mcp-server/
│   │   ├── mcp.bob.json
│   │   ├── apic-management-mcp-server-0.0.1.tgz
│   │   ├── commands/
│   │   │   └── *.md
│   │   └── skills/
│   └── apic-idig-mcp-server/
│       ├── mcp.bob.json
│       ├── apic-idig-mcp-server-0.0.1.tgz
│       ├── commands/
│       │   └── *.md
│       └── skills/
├── .git/                            # Git repository metadata
└── README.md                        # Repository documentation
```

## Installation Workflow

### Step 1: Verify Prerequisites

Execute prerequisite checks as outlined in the Prerequisites Verification section above.

**Validation Checkpoint**: All prerequisites must pass before proceeding.

### Step 2: Create Installation Directory

Create the standardized installation directory structure:

```bash
# macOS/Linux
mkdir -p ~/apic-mcp/servers

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\apic-mcp\servers"
```

**Validation Checkpoint**: Verify directory creation:
```bash
# macOS/Linux
ls -la ~/apic-mcp/

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\apic-mcp\"
```

### Step 3: Clone Repository

Clone the official APIC MCP server repository into the installation directory:

```bash
# macOS/Linux
cd ~/apic-mcp && git clone https://github.com/ibm-apiconnect/apic-mcp-server.git temp-clone
mv temp-clone/* temp-clone/.git* . 2>/dev/null || true
rm -rf temp-clone

# Windows (PowerShell)
cd "$env:USERPROFILE\apic-mcp"
git clone https://github.com/ibm-apiconnect/apic-mcp-server.git temp-clone
Move-Item -Path "temp-clone\*" -Destination "." -Force
Move-Item -Path "temp-clone\.git*" -Destination "." -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp-clone" -Recurse -Force
```

**Error Handling**:
- If directory already contains a git repository:
  ```bash
  # macOS/Linux
  cd ~/apic-mcp && git pull origin main

  # Windows (PowerShell)
  cd "$env:USERPROFILE\apic-mcp"; git pull origin main
  ```
- If clone fails due to network issues, retry up to 3 times with 5-second delays
- If directory is not empty and not a git repository, prompt user to:
  - [A] Backup and clear the directory
  - [B] Choose a different installation directory
  - [C] Cancel installation

**Validation Checkpoint**: Verify repository structure:
```bash
# macOS/Linux
ls -la ~/apic-mcp/servers/

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\apic-mcp\servers\"
```
Expected: Multiple subdirectories containing `mcp.bob.json` and `.tgz` files.

### Step 4: Create Workspace Configuration Directory

Create the `.bob` directory in the current workspace:

```bash
# All platforms (from workspace root)
mkdir -p .bob
```

**Validation Checkpoint**: Verify `.bob` directory exists in workspace root.

### Step 5: Initialize MCP Configuration File

Check if `.bob/mcp.json` exists. If not, create it with the base structure:

```json
{
  "mcpServers": {}
}
```

**Implementation**:
```bash
# macOS/Linux
if [ ! -f .bob/mcp.json ]; then
  echo '{"mcpServers":{}}' > .bob/mcp.json
fi

# Windows (PowerShell)
if (-not (Test-Path ".bob\mcp.json")) {
  '{"mcpServers":{}}' | Out-File -FilePath ".bob\mcp.json" -Encoding utf8
}
```

**Validation Checkpoint**: Verify file exists and contains valid JSON:
```bash
# macOS/Linux
cat .bob/mcp.json | python -m json.tool

# Windows (PowerShell)
Get-Content .bob\mcp.json | ConvertFrom-Json
```

### Step 6: Discover MCP Servers

Scan the `~/apic-mcp/servers/` directory for MCP server configurations:

**Discovery Process**:
1. List all subdirectories in `~/apic-mcp/servers/`
2. For each subdirectory:
   - Check for `mcp.bob.json` file
   - Check for corresponding `.tgz` file

- Check for optional `commands/` directory
- Check for optional `skills/` directory
- Record server name and file paths

**Expected Servers** (as of current version):

- `apic-analytics-mcp-server`
- `apic-governance-mcp-server`
- `apic-management-mcp-server`
- `apic-management-ai-mcp-server`
- `apic-idig-mcp-server`

**Validation Checkpoint**: Verify each discovered server has both required files:

- `mcp.bob.json` (configuration template)
- `*.tgz` (server package)

Also record optional assets for selected servers:

- `commands/` (markdown command definitions)
- `skills/` (skill definitions for Bob agent)

### Step 7: Present Server Selection Checklist

After discovering all available MCP servers, present a checklist to the user for selection:

**Selection Interface**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Available APIC MCP Servers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the servers you want to install:

[ ] apic-analytics-mcp-server
    Description: Analytics tools for API usage, latency, and status monitoring

[ ] apic-governance-mcp-server
    Description: Governance tools for API validation and rule management

[ ] apic-management-mcp-server
    Description: Management tools for APIs, products, catalogs, and subscriptions

[ ] apic-management-ai-mcp-server
    Description: AI-powered tools for OpenAPI generation and enhancement

[ ] apic-idig-mcp-server
    Description: AI Gateway tools for LLM provider management and REST to MCP conversion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Instructions:
- Use arrow keys to navigate
- Press SPACE to select/deselect
- Press ENTER to confirm selection
- Select at least one server to continue

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Selection Rules**:

1. User must select at least one server
2. Multiple servers can be selected
3. Selection can be modified before confirmation
4. After confirmation, only selected servers will be configured

**Validation Checkpoint**: Confirm user has selected at least one server before proceeding.

### Step 8: Prepare Command and Skill Installation (Selected Servers Only)

Immediately after server selection, prepare command and skill installation for only the selected servers.

1. Ensure workspace command directory exists:

  ```bash
  # macOS/Linux
  mkdir -p .bob/commands

  # Windows (PowerShell)
  New-Item -ItemType Directory -Force -Path ".bob\commands"
  ```

1. Verify the official skills library is available via npm:

  ```bash
  # All platforms
  npx skills --help
  ```

1. Resolve selected server asset directories:

- Preferred location: `~/apic-mcp/servers/<server-name>/`
- Fallback location: `~/apic-mcp/assets/<service>_build/`
- Service name mapping rule:
  - `apic-idig-mcp-server` -> `idig`
  - `apic-management-ai-mcp-server` -> `management-ai`
  - etc. (strip `apic-` prefix and `-mcp-server` suffix)

1. For each selected server, detect:

- `commands/` directory (contains command markdown files)
- `skills/` directory (contains Bob skill definitions)

**Validation Checkpoint**: At least one of `commands/` or `skills/` is available for each selected server. If both are missing for a selected server, warn and continue MCP server installation.

### Step 9: Install Selected Commands and Skills

Install command and skill assets before any configuration-value prompts.

#### 9A. Install Commands into Workspace

For each selected server with a `commands/` directory:

1. Copy markdown command files into workspace `.bob/commands/`
2. Replace files when names already exist
3. Keep only markdown command files (`*.md`)

```bash
# macOS/Linux (example for one selected server)
mkdir -p .bob/commands
find ~/apic-mcp/servers/apic-idig-mcp-server/commands -type f -name "*.md" -exec cp -f {} .bob/commands/ \;

# Windows (PowerShell) (example for one selected server)
New-Item -ItemType Directory -Force -Path ".bob\commands" | Out-Null
Get-ChildItem "$env:USERPROFILE\apic-mcp\servers\apic-idig-mcp-server\commands" -Filter "*.md" -File -Recurse |
  ForEach-Object { Copy-Item $_.FullName ".bob\commands\" -Force }
```

If the server-specific `commands/` directory is only available in assets build output, use:

```bash
# macOS/Linux fallback example
find ~/apic-mcp/assets/idig_build/commands -type f -name "*.md" -exec cp -f {} .bob/commands/ \;
```

#### 9B. Install Skills for Bob Agent

For each selected server with a `skills/` directory, run:

```bash
# macOS/Linux example
npx skills add ~/apic-mcp/servers/apic-idig-mcp-server/skills --agent bob

# Windows (PowerShell) example
npx skills add "$env:USERPROFILE\apic-mcp\servers\apic-idig-mcp-server\skills" --agent bob
```

If the server-specific `skills/` directory is only available in assets build output, use:

```bash
# macOS/Linux fallback example
npx skills add ~/apic-mcp/assets/idig_build/skills --agent bob
```

**Validation Checkpoint**:

- `.bob/commands/` contains copied command markdown files for selected servers
- `npx skills add ... --agent bob` succeeds for each selected server that has skills
- Log success/failure per selected server without exposing secrets

### Step 10: Parse Server Configurations (Selected Servers Only)

After command and skill installation, parse selected server config templates.

For each selected MCP server:

1. Read `mcp.bob.json`:

  ```bash
  # macOS/Linux
  cat ~/apic-mcp/servers/apic-analytics-mcp-server/mcp.bob.json

  # Windows (PowerShell)
  Get-Content "$env:USERPROFILE\apic-mcp\servers\apic-analytics-mcp-server\mcp.bob.json"
  ```

1. Identify placeholders:

- Format: `${VARIABLE_NAME}` or `<PLACEHOLDER>`
- Common placeholders: `${API_KEY}`, `${BASE_URL}`, `${AUTH_TOKEN}`

1. Extract server metadata:

- Server name
- Command configuration
- Required environment variables
- Optional environment variables

**Validation Checkpoint**: Ensure all selected `mcp.bob.json` files are valid JSON and parseable.

### Step 11: Choose Configuration Mode

After command/skill installation and config parsing, ask the user how they want to provide configuration values:

**Configuration Mode Selection**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Configuration Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have selected 3 servers to configure.

How would you like to provide configuration values?

[1] Configure servers individually
   - Configure each server one at a time
   - Provide values specific to each server
   - Recommended if servers need different configurations

[2] Configure all servers at once
   - Provide common values once for all servers
   - Values are shared across all selected servers
   - Faster if all servers use the same credentials

Enter your choice [1 or 2]:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Validation Checkpoint**: Confirm user has selected a valid configuration mode (1 or 2).

### Step 12: Collect User Configuration (Selected Servers Only)

Configuration collection varies based on the mode selected:

#### Mode 1: Individual Server Configuration

Configure each server separately with server-specific values.

**IMPORTANT**: Bob must ask for each configuration value ONE AT A TIME, waiting for user input after each prompt. DO NOT ask for all values at once or request JSON input.

**Prompting Order**:

1. Present servers one at a time
2. For each server, ask for ONE configuration value at a time
3. Wait for user response before asking for the next value
4. Validate each input before moving to the next
5. Complete all values for current server before moving to next server

**Example Interaction** (showing one-value-at-a-time prompting):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Configuring 3 selected servers individually
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/3] Configuring: apic-analytics-mcp-server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please provide the following configuration values one at a time:

API_KEY (required):
Enter API key for analytics: _

[User enters value, Bob validates, then continues]

BASE_URL (optional, default: https://api.example.com):
Enter base URL or press Enter for default: _

[User enters value or presses Enter, Bob validates, then continues]

ANALYTICS_ENDPOINT (required):
Enter analytics endpoint: _

[User enters value, Bob validates, then continues]

TIMEOUT (optional, default: 30000):
Enter timeout in ms or press Enter for default: _

[User enters value or presses Enter, Bob validates]

✓ apic-analytics-mcp-server configuration complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[2/3] Configuring: apic-governance-mcp-server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please provide the following configuration values one at a time:

API_KEY (required):
Enter API key for governance: _

[Process continues one value at a time...]
```

**Critical Rules for Bob**:

- ❌ DO NOT show all fields at once and wait for user to fill them
- ❌ DO NOT ask user to provide JSON or structured data
- ❌ DO NOT ask for multiple values in a single prompt
- ✅ DO ask for ONE value at a time
- ✅ DO wait for user response after each prompt
- ✅ DO validate each value before proceeding to next
- ✅ DO show clear labels indicating required vs optional
- ✅ DO show defaults for optional values

#### Mode 2: All-at-Once Configuration

Collect unique configuration values once and apply to all servers.

**IMPORTANT**: Bob must ask for each unique configuration value ONE AT A TIME, waiting for user input after each prompt. DO NOT ask for all values at once or request JSON input.

**Prompting Strategy**:

1. Analyze all selected servers to identify unique configuration parameters
2. Group common parameters (e.g., API_KEY, BASE_URL appear in multiple servers)
3. Prompt for each unique parameter ONE AT A TIME
4. Wait for user response before asking for the next value
5. Apply provided values to all servers that require them

**Example Interaction** (showing one-value-at-a-time prompting):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Configuring all servers with shared values
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I will now ask for configuration values one at a time.
Each value will be applied to all servers that need it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common Configuration Values
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API_KEY (required, used by all 3 servers):
Enter API key: _

[User enters value, Bob validates, then continues]

BASE_URL (optional, default: https://api.example.com, used by all 3 servers):
Enter base URL or press Enter for default: _

[User enters value or presses Enter, Bob validates, then continues]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service-Specific Configuration Values
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANALYTICS_ENDPOINT (required, used by apic-analytics-mcp-server):
Enter analytics endpoint: _

[User enters value, Bob validates, then continues]

GOVERNANCE_ENDPOINT (required, used by apic-governance-mcp-server):
Enter governance endpoint: _

[User enters value, Bob validates, then continues]

MANAGEMENT_ENDPOINT (required, used by apic-management-mcp-server):
Enter management endpoint: _

[User enters value, Bob validates, then continues]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optional Shared Values
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMEOUT (optional, default: 30000, used by all servers):
Enter timeout in ms or press Enter for default: _

[User enters value or presses Enter, Bob validates]

✓ All configuration values collected successfully
✓ Values will be applied to all selected servers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Critical Rules for Bob**:

- ❌ DO NOT show all fields at once and wait for user to fill them
- ❌ DO NOT ask user to provide JSON or structured data
- ❌ DO NOT ask for multiple values in a single prompt
- ✅ DO ask for ONE value at a time
- ✅ DO wait for user response after each prompt
- ✅ DO validate each value before proceeding to next
- ✅ DO clearly indicate which servers will use each value
- ✅ DO show defaults for optional values
- ✅ DO group values logically (common, service-specific, optional)

**Configuration Mapping**:

- Common values (API_KEY, BASE_URL) are asked once and applied to all servers
- Service-specific values (endpoints) are asked once per unique parameter
- Each server's configuration file receives the appropriate values

**Input Validation** (applies to both modes):

- API_KEY: Non-empty string, minimum 10 characters
- BASE_URL: Valid URL format (http:// or https://)
- Endpoint URLs: Valid URL format
- Numeric values: Validate as integers/floats
- Boolean values: Accept true/false, yes/no, 1/0

**Validation Checkpoint**: Confirm all required values collected for all selected servers before proceeding.

### Step 13: Generate Absolute Paths (Selected Servers Only)

Convert all file paths to absolute paths for consistency:

```bash
# macOS/Linux
INSTALL_DIR=$(cd ~/apic-mcp && pwd)

# Windows (PowerShell)
$INSTALL_DIR = (Resolve-Path "$env:USERPROFILE\apic-mcp").Path
```

**Path Construction**:

- `.tgz` file path: `${INSTALL_DIR}/servers/${SERVER_NAME}/${SERVER_NAME}-${VERSION}.tgz`
- Example: `/Users/username/apic-mcp/servers/apic-analytics-mcp-server/apic-analytics-mcp-server-0.0.1.tgz`

**Validation Checkpoint**: Verify all `.tgz` files for selected servers exist at constructed paths.

### Step 14: Update Configuration File (Selected Servers Only)

Merge new server configurations with existing `.bob/mcp.json`:

**Merge Strategy**:

1. Read existing configuration
2. Parse as JSON object
3. For each selected server:
   - Add to `mcpServers` object
   - Replace placeholders with user values
   - Use absolute paths for `.tgz` files
4. Preserve existing server configurations
5. Write updated JSON with proper formatting (2-space indentation)

**Configuration Template**:

```json
{
  "mcpServers": {
    "apic-analytics-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "-p",
        "/Users/username/apic-mcp/servers/apic-analytics-mcp-server/apic-analytics-mcp-server-0.0.1.tgz",
        "apic-analytics-mcp-server"
      ],
      "env": {
        "API_KEY": "user-provided-value",
        "BASE_URL": "https://api.example.com"
      }
    }
  }
}
```

**Validation Checkpoint**: Validate updated JSON syntax:

```bash
# macOS/Linux
cat .bob/mcp.json | python -m json.tool > /dev/null && echo "Valid JSON"

# Windows (PowerShell)
try { Get-Content .bob\mcp.json | ConvertFrom-Json; Write-Host "Valid JSON" } catch { Write-Host "Invalid JSON" }
```

### Step 15: Verify Installation (Selected Servers Only)

Perform comprehensive verification of the installation for selected servers:

**Verification Checklist**:

1. ✓ All `.tgz` files for selected servers exist at specified paths
2. ✓ All required environment variables for selected servers are set
3. ✓ `.bob/mcp.json` contains valid JSON
4. ✓ All selected server configurations are present
5. ✓ No placeholder values remain in configuration
6. ✓ `.bob/commands/` contains expected selected-server command files
7. ✓ Skills were added for selected servers (from `skills add` command results)
8. ✓ File permissions are correct (readable)

**Automated Verification**:

```bash
# macOS/Linux
for server in ~/apic-mcp/servers/*/; do
  server_name=$(basename "$server")
  tgz_file=$(find "$server" -name "*.tgz" -type f)
  if [ -f "$tgz_file" ]; then
    echo "✓ $server_name: Package found"
  else
    echo "✗ $server_name: Package missing"
  fi
done

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\apic-mcp\servers\" -Directory | ForEach-Object {
  $serverName = $_.Name
  $tgzFile = Get-ChildItem $_.FullName -Filter "*.tgz" -File
  if ($tgzFile) {
    Write-Host "✓ $serverName : Package found"
  } else {
    Write-Host "✗ $serverName : Package missing"
  }
}
```

**Validation Checkpoint**: All verification checks for selected servers must pass.

### Step 16: Report Installation Status

Provide comprehensive installation summary:

**Report Format**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APIC MCP Server Installation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Installation Directory: ~/apic-mcp
Configuration File: .bob/mcp.json

Configured Servers (3 of 5 available):
  ✓ apic-analytics-mcp-server
  ✓ apic-governance-mcp-server
  ✓ apic-management-mcp-server

Commands Installed:
  ✓ 6 markdown command files copied to .bob/commands

Skills Installed:
  ✓ apic-analytics-mcp-server skills added for bob agent
  ✓ apic-governance-mcp-server skills added for bob agent
  ✓ apic-management-mcp-server skills added for bob agent

Skipped Servers (not selected):
  - apic-management-ai-mcp-server
  - apic-idig-mcp-server

Next Steps:
  1. Restart your IDE/editor to load the new MCP servers
  2. Verify server connectivity in MCP settings
  3. Review server documentation at:
     ~/apic-mcp/README.md

Troubleshooting:
  - If servers don't appear, check .bob/mcp.json syntax
  - Verify environment variables are set correctly
  - Check server logs for connection issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Rules

1. **Path Consistency**:
   - Always use absolute paths in configuration files
   - Use platform-appropriate path separators
   - Expand `~` to full home directory path

2. **Configuration Preservation**:
   - Never overwrite existing server configurations without confirmation
   - Merge new configurations with existing ones
   - Backup `.bob/mcp.json` before modifications

3. **Error Recovery**:
   - Provide clear error messages with resolution steps
   - Allow resuming interrupted installations
   - Save partial progress to avoid data loss

4. **Validation at Every Step**:
   - Verify prerequisites before starting
   - Check file existence after each operation
   - Validate JSON syntax after modifications
   - Confirm user inputs before applying

5. **Reproducibility**:
   - Use consistent directory structure across all platforms
   - Document exact commands for each platform
   - Version-lock package references where possible
   - Log all operations for debugging

6. **Security**:
   - Never log sensitive values (API keys, tokens)
   - Validate user inputs to prevent injection
   - Use secure file permissions (readable by user only)

7. **Execution Order**:

- Always install selected `commands/` and `skills/` assets immediately after server selection
- Complete command and skill installation before asking any configuration-value questions

## Error Handling

### Git Not Installed

**Error**: `git: command not found`

**Resolution**:

1. Display installation instructions for user's platform
2. Provide download links
3. Wait for user to install git
4. Re-verify installation before proceeding

### Repository Clone Failure

**Error**: `fatal: destination path 'apic-mcp' already exists`

**Resolution**:

1. Check if directory contains a git repository:

   ```bash
   cd ~/apic-mcp && git status
   ```

2. If yes, offer to update: `git pull origin main`
3. If no, offer options:
   - Backup existing directory
   - Choose different location
   - Cancel installation

### Network Connectivity Issues

**Error**: `fatal: unable to access 'https://github.com/...'`

**Resolution**:

1. Check internet connectivity
2. Verify GitHub accessibility
3. Check proxy/firewall settings
4. Retry with exponential backoff (3 attempts)
5. Offer manual download option

### Invalid JSON Configuration

**Error**: `Unexpected token in JSON`

**Resolution**:

1. Backup corrupted file
2. Attempt to repair JSON (remove trailing commas, fix quotes)
3. If repair fails, recreate from template
4. Restore user configurations from backup

### Missing Package Files

**Error**: `.tgz file not found`

**Resolution**:

1. Verify repository clone completed successfully
2. Check if `servers/` directory exists
3. Re-clone repository if files missing
4. Verify git checkout completed without errors

### Missing Commands or Skills Assets

**Error**: Selected server does not contain `commands/` and/or `skills/`

**Resolution**:

1. Check both locations:

- `~/apic-mcp/servers/<server-name>/`
- `~/apic-mcp/assets/<service>_build/`

2. If `commands/` is missing, continue MCP server setup and report that command shortcuts were not installed
2. If `skills/` is missing, continue MCP server setup and report that Bob skills were not installed
3. If both are missing for all selected servers, complete MCP setup and show remediation steps to update repository/build artifacts

### Skills CLI Installation Failure

**Error**: `npx skills add <path> --agent bob` fails

**Resolution**:

1. Re-run: `npx skills --help` to confirm package availability
2. Verify the skills path exists and contains valid skill files
3. Retry `npx skills add <path> --agent bob` once per selected server
4. If still failing, continue MCP setup, report skill-install failure, and provide manual retry command in final summary

### Permission Denied
**Error**: `Permission denied` when creating directories/files

**Resolution**:
1. Check user has write permissions to target directory
2. Suggest using different installation directory
3. On Unix systems, check if `sudo` is needed (not recommended)
4. Verify disk space availability

## Post-Installation Verification

### Optional Server Connection Test

After installation, optionally test each configured server:

```bash
# Test server initialization (example)
npx -y -p ~/apic-mcp/servers/apic-analytics-mcp-server/apic-analytics-mcp-server-0.0.1.tgz apic-analytics-mcp-server --version
```

**Expected Output**: Server version information or help text

**If Test Fails**:
1. Verify `.tgz` file integrity
2. Check environment variables are set
3. Verify Node.js version compatibility
4. Review server-specific documentation

### Troubleshooting Guide

**Servers Not Appearing in IDE**:
1. Restart IDE/editor completely
2. Verify `.bob/mcp.json` is in workspace root
3. Check JSON syntax validity
4. Review IDE's MCP server logs

**Connection Errors**:
1. Verify environment variables are correct
2. Check network connectivity to required services
3. Review server logs for specific errors
4. Ensure API keys/tokens are valid

**Performance Issues**:
1. Check system resources (CPU, memory)
2. Verify no conflicting processes
3. Review server timeout settings
4. Consider increasing timeout values

### Documentation Links

After installation, users can access:
- Main repository: `~/apic-mcp/README.md`
- Server-specific docs: `~/apic-mcp/servers/[server-name]/README.md`
- Online documentation: https://github.com/ibm-apiconnect/apic-mcp-server

## Maintenance

### Updating Servers

To update to the latest version:

```bash
# macOS/Linux
cd ~/apic-mcp && git pull origin main

# Windows (PowerShell)
cd "$env:USERPROFILE\apic-mcp"; git pull origin main
```

After updating, re-run configuration steps if new servers are added or configurations change.

### Backup Configuration

Regularly backup your configuration:

```bash
# macOS/Linux
cp .bob/mcp.json .bob/mcp.json.backup

# Windows (PowerShell)
Copy-Item .bob\mcp.json .bob\mcp.json.backup
```

### Uninstallation

To remove APIC MCP servers:

```bash
# macOS/Linux
rm -rf ~/apic-mcp
rm -rf .bob/mcp.json

# Windows (PowerShell)
Remove-Item -Path "$env:USERPROFILE\apic-mcp" -Recurse -Force
Remove-Item -Path ".bob\mcp.json" -Force
