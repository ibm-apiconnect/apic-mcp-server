---
name: studio-kind-file-packager
description: Locate and package API Studio Kind file assets (API, Product, or MCPServer types) with all their dependencies. Recursively follows $ref and $path references to build a complete dependency graph, then packages all related files into a zip archive.
license: MIT
---

# API Studio Kind File Packager Skill

## Overview

This skill helps you locate API Studio Kind file assets in the workspace and package them with all their dependencies. It's designed to work with API Connect API Studio Kind files (API, Product, MCPServer, etc.) that use `$ref` and `$path` references to link to other files.

## What It Does

1. **Locates Kind Files**: Finds Kind file assets by name or file path
2. **Recursive Dependency Resolution**: Follows all `$ref` and `$path` references recursively
3. **Dependency Graph Construction**: Builds a complete map of all related files
4. **Packaging**: Creates a zip archive containing all discovered files
5. **Reporting**: Provides a comprehensive list of all packaged files

## Installation

First, install the required Node.js dependencies:

```bash
cd .bob/skills/studio-kind-file-packager
npm install
```

## Usage

### Basic Usage

To package a Kind file and its dependencies:

```bash
node .bob/skills/studio-kind-file-packager/scripts/package_kind_files.js --input "DPv6_Product" --workspace "api-studio-samples/projects/v1"
```

### Input Options

The script accepts either:
- **Name**: The name of a Kind file (e.g., "DPv6_Product", "WeatherApi")
- **Path**: A relative or absolute path to a Kind file (e.g., "datapower-api-gateway/DPv6_Product_Weather/DPv6_Product.yml")

### Output

The script will:
1. Search for the specified Kind file
2. Parse it to find all `$ref` and `$path` references
3. Recursively process all referenced files
4. Create a zip archive named `{kind_name}_package.zip`
5. Print a list of all files included in the archive

## Reference Patterns

The skill understands these reference patterns commonly used in Kind files:

### $ref Pattern
References to other Kind files using namespace:name:version format:
```yaml
apis:
  - $ref: DPv6_Product_Weather:WeatherApi:1.0
plans:
  - $ref: DPv6_Product_Weather:DPv6_Plan:1.0
```

### $path Pattern
References to external files (OpenAPI specs, WSDL, etc.):
```yaml
api-spec:
  $path: ./WeatherApi-spec.yml
```

## Examples

### Example 1: Package a Product with APIs

```bash
node .bob/skills/studio-kind-file-packager/scripts/package_kind_files.js \
  --input "DPv6_Product" \
  --workspace "api-studio-samples/projects/v1"
```

This will find the Product file, follow references to APIs, Plans, Assemblies, and OpenAPI specs, and package everything together.

### Example 2: Package by File Path

```bash
node .bob/skills/studio-kind-file-packager/scripts/package_kind_files.js \
  --input "datapower-nano-gateway/DPNano_Product_Weather/DPNano_Product.yml" \
  --workspace "api-studio-samples/projects/v1"
```

### Example 3: Package with Custom Output

```bash
node .bob/skills/studio-kind-file-packager/scripts/package_kind_files.js \
  --input "WeatherApi" \
  --workspace "api-studio-samples/projects/v1" \
  --output "my_weather_api_package.zip"
```

## Kind File Types Supported

- **API**: REST or SOAP API definitions
- **Product**: Product definitions containing APIs and Plans
- **MCPServer**: MCP Server configurations
- **FreeFlowPolicySequence**: Policy sequences for DataPower
- **Plan**: Rate limiting and quota plans
- **Assembly**: DataPower assembly configurations
- And other Kind file types with `$ref` or `$path` references

## Technical Details

### Dependency Resolution Algorithm

1. **Initial File Discovery**: Locate the starting Kind file by name or path
2. **Parse YAML**: Extract all `$ref` and `$path` references
3. **Reference Resolution**:
   - For `$ref`: Parse namespace:name:version format and locate the file
   - For `$path`: Resolve relative paths from the current file's directory
4. **Recursive Processing**: Add discovered files to a queue and repeat steps 2-3
5. **Deduplication**: Track processed files to avoid infinite loops
6. **Packaging**: Collect all unique files and create a zip archive

### File Structure in Archive

The zip archive preserves the original directory structure relative to the workspace root, making it easy to extract and use the files in their original context.

## Requirements

- Node.js 14.0.0 or higher
- npm (Node Package Manager)

Install dependencies:
```bash
cd .bob/skills/studio-kind-file-packager
npm install
```

Required npm packages:
- `js-yaml`: YAML parsing
- `archiver`: ZIP archive creation
- `commander`: Command-line interface

## Error Handling

The script handles common errors gracefully:
- **File Not Found**: Reports missing files but continues processing other references
- **Invalid YAML**: Skips malformed files and reports the issue
- **Circular References**: Detects and prevents infinite loops
- **Invalid References**: Reports unparseable references but continues

## Output Format

The script outputs:
1. **Progress Messages**: Shows which files are being processed
2. **Dependency Tree**: Visual representation of the file relationships
3. **File List**: Complete list of all files in the archive
4. **Archive Location**: Path to the created zip file
5. **Statistics**: Total number of files and archive size