# Project Publish Tool

**Tool description**: This tool takes a zip file path that contains project assets for IDIG and publishes them to the IDIG platform.

**Tool Details**:
- This tool helps with the task of publishing project assets to the IDIG platform.

## Skills

### studio-kind-file-packager

The Studio Kind File Packager skill simplifies the process of preparing API Studio projects for publishing by automatically packaging Kind files with all their dependencies into a zip archive.

**How it works:**
1. The skill analyzes your Kind file (API, Product, MCPServer, Plan, Assembly, etc.)
2. Recursively resolves all `$ref` and `$path` dependencies
3. Builds a complete dependency graph
4. Creates a zip archive containing all related files with preserved directory structure

**Integration with Publishing:**
The generated zip file can be directly published using the publishing tool by passing in the path to the zip file.

**Installation:**
This skill should already be installed if you used the `init-apic-mcp` command for Bob setup. Otherwise, you can install it by following [these steps](../../../init-apic-mcp.md#9b-install-skills-for-bob-agent).

**Sample Usage:**

```text
/package-kind-files @mcp-server-kind.yaml
```

### Table 1. IDIG Parameters

| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| zipFilePath | Yes | The absolute file path to the .zip file to publish. | None |
| publishToPortal | Yes | Flag to indicate if the project should be published to the IDIG portal. | False |
| projectName | No | The name of the project to publish. | None |

**Sample Prompts**:

```text
Publish the project @my_project_assets.zip to IDIG
```

```text
Publish the project @my_project_assets.zip and publish to IDIG portal
```

For more information, see [Managing AI services using IBM DataPower Interact Gateway](https://www.ibm.com/docs/en/api-connect/cloud/12.1.0_saas?topic=managing-ai-services-using-datapower-interact-gateway).
