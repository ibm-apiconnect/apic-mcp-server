---
description: Package API Studio Kind file assets with all their dependencies using the Studio Kind File Packager skill
---

Use the [Studio Kind File Packager](.bob/skills/studio-kind-file-packager/SKILL.md) skill.

Required input:

- Kind file name or path (e.g., "DPv6_Product" or "datapower-api-gateway/DPv6_Product_Weather/DPv6_Product.yml")
- Workspace directory path (relative to project root)

Optional input:

- Custom output zip file name

Workflow:

1. Verify the user has provided either:
   - A Kind file name (e.g., "DPv6_Product", "WeatherApi", "MCPServer")
   - A relative or absolute path to a Kind file
2. Verify the user has provided the workspace directory path where Kind files are located.
3. Run:

   ```bash
   node ./.bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "<KIND_FILE_NAME_OR_PATH>" --workspace "<WORKSPACE_PATH>"
   ```

4. Optionally, if the user wants a custom output name:

   ```bash
   node ./.bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "<KIND_FILE_NAME_OR_PATH>" --workspace "<WORKSPACE_PATH>" --output "<CUSTOM_OUTPUT_NAME>.zip"
   ```

5. The script will:
   - Locate the specified Kind file
   - Recursively resolve all `$ref` and `$path` dependencies
   - Build a complete dependency graph
   - Create a zip archive with all related files
   - Display a list of all packaged files

Important rules:

- The skill supports API, Product, MCPServer, Plan, Assembly, and other Kind file types
- Dependencies are resolved recursively following `$ref` (namespace:name:version) and `$path` (file paths) patterns
- The output zip preserves the original directory structure
- If a file is not found, the script reports it but continues processing other references
- Circular references are detected and handled to prevent infinite loops
- The default output name is `{kind_name}_package.zip` in the current directory

Example commands:

```bash
# Package by Kind file name
node ./.bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "DPv6_Product" --workspace "api-studio-samples/projects/v1"

# Package by file path
node ./.bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "datapower-nano-gateway/DPNano_Product_Weather/DPNano_Product.yml" --workspace "api-studio-samples/projects/v1"

# Package with custom output name
node ./.bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "WeatherApi" --workspace "api-studio-samples/projects/v1" --output "my_weather_api_package.zip"
```

Expected output:

- Progress messages showing which files are being processed
- A dependency tree visualization
- Complete list of all files included in the archive
- Archive location and statistics (file count, size)
