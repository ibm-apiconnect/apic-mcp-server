# Skills

## apic-openapi-operation-selector

The OpenAPI Operation Selector skill helps you select specific operations from an OpenAPI specification, for example as the pre-step for the REST to MCP Generator tool, or any other flow that requires a `selectedOperations` map (path → HTTP methods).

**How it works:**

1. The skill reads your OpenAPI file (JSON, YAML, or YML) and presents all available path + HTTP method combinations as numbered options, using the operation's `operationId` where available, or `<METHOD> <path>` otherwise.
2. You respond in chat with a comma-separated list of option numbers (e.g. `1,3,4`), or `all` to include every operation.
3. The skill runs the selection script again with your chosen indexes and returns a JSON object mapping paths to arrays of HTTP methods.

**Example output:**

```json
{
  "/weather": ["get"],
  "/pets": ["get", "post"]
}
```

**Integration with the REST to MCP Generator:**
This skill is the required pre-step for the `RestToMCPGenerator` to select the right operations. It is automatically triggered when the RestToMCP Tool is triggered without the `selectedOperations`.  The skill collects your selection and the RestToMCP tool is automatically invoked with the resulting `selectedOperations` map.

---

## api-studio-project-manager

The Studio Project Manager skill creates and manages API Studio projects in your workspace. A studio project is required when you need to publish generated MCP or LLM assets to the IDIG platform, because the packaging tool (`api-studio-build-project`) can only read files that are part of a studio project.

**How it works:**

The skill is triggered automatically when a tool flow requires a studio project to be created. You can also invoke it explicitly using the key phrase `in a new project`, for example:

```text
Generate a MCP spec for /path/to/openapi_file.yaml in a new project my-mcp
```

**Integration with Other Tools:**
This skill is used as part of the REST to MCP, MCP to MCP, and LLM Provider Generation flows when a publish step is required. It creates the studio project that serves as the workspace for generated Kind files before packaging and publishing.

---

## api-studio-build-project

The Studio Kind File Packager skill simplifies the process of preparing API Studio projects for publishing by automatically packaging Kind files with all their dependencies into a zip archive.

**How it works:**

1. You provide a Kind file name (e.g. `DPv6_Product`, `WeatherApi`, `MCPServer`) or a relative path to a Kind file, plus the workspace directory path where Kind files are located.
2. The skill locates the specified Kind file and recursively resolves all `$ref` (namespace:name:version) and `$path` (file path) dependencies.
3. It builds a complete dependency graph, detecting and handling any circular references.
4. A zip archive is created that preserves the original directory structure, and the skill outputs a dependency tree visualization, the list of all packaged files, and the archive location and statistics.

The default output file name is `{kind_name}_package.zip` in the current directory.

**Supported Kind file types:** API, Product, MCPServer, Plan, Assembly, and others.

**Integration with Publishing:**
This skill is triggered automatically when a publish request is made and no pre-existing zip file is found for the project. The generated zip file is passed directly to the publish tool (`zipFilePath` parameter).

---

## Installation

These skills are installed automatically by the `init-apic-ai-assets` setup command. If you need to install them, see the [Quick Start](../README.md#quick-start) instructions.
