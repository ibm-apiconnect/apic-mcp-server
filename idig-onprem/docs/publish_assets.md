# Project Publish Tool

**Tool description**: This tool takes a zip file path that contains project assets for IDIG and publishes them to the IDIG platform.

**Tool Details**:
- This tool helps with the task of publishing project assets to the IDIG platform.

**Note**: This operation makes use of the [`api-studio-build-project`](skills.md#api-studio-build-project) skill to help in creating a build artifact zip file that can successfully be published. The skill is triggered automatically once a publish request is made and there is no pre-existing zip file for the project.

### Table 1. IDIG Parameters

| Parameter | Required | Description | Default |
| -------- | ------- | -------- | ------- |
| zipFilePath | Yes | The absolute file path to the .zip file to publish. | — |
| publishToPortal | No | Flag to indicate if the project should be published to the IDIG portal. | False |
| projectName | No | The name of the project to publish. | None |

**Sample Prompts**:

```text
Publish the project @my_project_assets.zip to IDIG
```

```text
Publish the project @my_project_assets.zip and publish to IDIG portal
```

For more information, see [Managing AI services using IBM DataPower Interact Gateway](https://www.ibm.com/docs/en/api-connect/cloud/12.1.0_saas?topic=managing-ai-services-using-datapower-interact-gateway).
