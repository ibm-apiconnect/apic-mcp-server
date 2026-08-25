# LLM Provider Generator

The `LLMProviderGenerator` tool generates publish read connections for registering LLM providers for governed access with `IBM DataPower Interact Gateway`.

**Key highlights**:
- Generation of KIND documents from a Natrual Language Prompt that allow you to connect to several types of AI Platforms that provide connections to LLMs via the `IBM DataPower Interact Gateway`. 
- Supports three types of operations including:
   - [ListLLMProviders](#ListLLMProviders): for listing what LLM Providers are available for generation
   - [LLMProviderGenerator](#LLMProviderGenerator): for generating the connections from scratch.

## ListLLMProviders
This tool can be used to list the LLM Providers available for generation. Azure OpenAI, Gemini, OpenAI, WatsonX, and Custom (OpenAI Compatible) platforms are supported.

**Example prompts**
```
List LLM Providers available for generation
```

```
What LLM Platforms can I connect to?
```

```
Are there LLM Platform Providers that I can use?
```

For more information please see the [Registering LLM Providers for governed access with IBM DataPower Interact Gateway](https://ibmdocs-test.dcs.ibm.com/docs/en/v12saas_internal_test?topic=gateway-registering-llm-providers-governed-access)

## LLMProviderGenerator
This tool can be used to generate connections to various LLM Providers with the IBM DataPower Interact Gateway. This enables organizations to register and manage access to LLM providers through a centralized and governed interface.

### Parameters for the LLMProviderGenerator

| Parameter | Required | Default | Description |
| -------- | ------- | ------- | -------- |
| platform | Yes | - | Identifier of the LLM Provider (watsonx, openai, azure-openai, gemini, custom) |
| xIbmProject | Yes | - | Name or ID of the project that the generation is occurring in |
| apiKeySecretName | Yes | - | Name of the API key secret for authenticating with the LLM provider (references the secret stored securely in the gateway) |
| connectionName | No | "" | Name or ID of the connection being generated |
| basePath | No | "" | Base path for the LLM provider API |
| version | No | "1.0" | Version of the LLM provider |
| tags | No | [] | Tags for categorizing the LLM provider |
| tlsClientProfile | No | "tls-client-profile-default:1.0.0" | TLS client profile for secure connections |
| region | No | - | Region (WatsonX only) |
| projectId | No | - | Project ID (WatsonX and OpenAI only) |
| orgId | No | - | Organization ID (OpenAI only) |
| opVersion | No | - | Operation version (WatsonX and Azure OpenAI only) |
| deploymentId | No | - | Deployment ID (Azure OpenAI only) |
| resourceId | No | - | Resource ID (Azure OpenAI only) |
| providerUrl | No | - | Provider URL (custom providers only) |
| responseCaching | No | true | Enable response caching for the LLM provider |
| cacheTTL | No | 60 | Cache time-to-live in seconds |
| maxTokens | No | 1000 | Maximum tokens for rate limiting |
| tokenTimeInterval | No | 1 | Time interval for token rate limit in seconds |
| maxRequests | No | 1000 | Maximum requests for rate limiting |
| requestTimeInterval | No | 1 | Time interval for request rate limit in seconds |
| intervalUnit | No | "seconds" | Time unit for rate limit intervals (applies to both token and request limits) |
| exceedAction | No | "continue" | Action to take when rate limits are exceeded (applies to both token and request limits) |
| errorHandlingEnabled | No | false | Enable error handling |
| errorHandlingType | No | "plain" | Error handling type |
| errorMessage | No | "An error occurred while processing your request." | Custom error message |
| errorCode | No | 400 | HTTP error code |
| telemetryEnabled | No | true | Enable telemetry |
| telemetryLogLevel | No | "default" | Telemetry log level |

**Example prompts**
```
Generate LLM Provider documents for watsonx in the project test with api key secret watsonx-api-key
```

```
Set up a gemini connection called dev-gemini-conn in project project-1 using api key secret gemini-api-key
```

```
Create an OpenAI LLM Provider for project dev with orgId my-org, projectId proj-123 and api key secret openai-api-key
```

```
I need an azure-openai wired up for the azure-project with deploymentId gpt-5-chat, resourceId nano-openai-test and the connection name azure-openai-conn and api key secret azure-secret
```

```
Set up a custom OpenAI-compatible provider for project dev with providerUrl https://api.custom-llm.com/v1, model llama-3-70b and api key secret custom-api-key
```

```
Set up a production-ready watsonx connection wx-prod-conn for project prod in region us-south with projectId 123-356-789, tag production, caching on with 600s TTL, rate limit 10000 tokens and 200 requests per minute, error handling enabled returning 429 with message "Rate limit exceeded on watsonx provider", default telemetry and api key secret watsonx-api-key
```

For more information please see the [Registering LLM Providers for governed access with IBM DataPower Interact Gateway](https://ibmdocs-test.dcs.ibm.com/docs/en/v12saas_internal_test?topic=gateway-registering-llm-providers-governed-access)
