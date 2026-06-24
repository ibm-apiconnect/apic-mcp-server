# Project Publish Tool

**Tool description**: This tool takes a zip file path that contains project assets for IDIG and publishes them to the IDIG platform.

**Tool Details**:
- This tool helps with the task of publishing project assets to the IDIG platform.
- **Note**: This tool is only available for [BYOCA](./byoca.md).

## Parameters

### Table 1. Publish Project Parameters (IBM API Studio)

| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| zipFilePath | Yes | The absolute file path to the .zip file to publish. | None |
| catalogId | Yes | The name of the APIM catalog to publish the project to. | None |
| projectName | No | The name of the project to publish. | None |

**Sample Prompts (IBM API Studio)**:

```text
Publish @project.zip to catalog my-catalog
```

### Table 2. IDIG Standalone Parameters (BYOCA)

| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| zipFilePath | Yes | The absolute file path to the .zip file to publish. | None |
| publishToPortal | Yes | Flag to indicate if the project should be published to the IDIG portal. | False |
| projectName | No | The name of the project to publish. | None |

**Sample Prompts (BYOCA)**:

```text
Publish the project @my_project_assets.zip to IDIG
```

```text
Publish the project @my_project_assets.zip and publish to IDIG portal
```

For more information, see [Managing AI services using IBM DataPower Interact Gateway](https://www.ibm.com/docs/en/api-connect/cloud/12.1.0_saas?topic=managing-ai-services-using-datapower-interact-gateway).
