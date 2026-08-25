# Catalog & Subscription Management

- [ListCatalogs](#listcatalogs)
- [ListGatewaysInCatalog](#listgatewaysincatalog)
- [ListConsumerOrgs](#listconsumerorgs)
- [CreateConsumerApp](#createconsumerapp)
- [ListSubscriptionsInConsumerApp](#listsubscriptionsinconsumerapp)
- [ListSubscriptionsInACatalog](#listsubscriptionsinacatalog)
- [CreateSubscriptionForPublishedAsset](#createsubscriptionforpublishedasset)

---

## ListCatalogs

**Tool name**: ListCatalogs

**Description**: Lists all catalogs in the API Connect provider organization. Supports pagination with limit and offset.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `limit` | No | Maximum number of catalogs to return | `100` |
| `offset` | No | Number of catalogs to skip before starting to return results | `0` |

### Example Prompts

```text
List catalogs
```

```text
List catalogs with limit 20
```

```text
List catalogs with limit 10 and offset 3
```

---

## ListGatewaysInCatalog

**Tool name**: ListGatewaysInCatalog

**Description**: Lists all gateways configured in a specific catalog or space from API Connect. Returns gateway name, title, type, state, and URL. Defaults to the `sandbox` catalog if not specified. Note: the sandbox catalog does not support spaces.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `catalog` | No | Name or ID of the catalog | `sandbox` |
| `space` | No | Name of the space within the catalog. If provided, lists gateways from the space instead of the catalog | - |
| `limit` | No | Maximum number of gateways to return | `100` |
| `offset` | No | Number of gateways to skip before starting to return results | `0` |

### Example Prompts

```text
List gateways in catalog sandbox
```

```text
List gateways in catalog production with limit 30
```

```text
List gateways in space dev in catalog production
```

```text
List gateways in catalog staging with limit 10 and offset 3
```

---

## ListConsumerOrgs

**Tool name**: ListConsumerOrgs

**Description**: Lists all consumer organizations in a specific catalog from API Connect. Supports pagination with limit and offset.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `catalog` | No | Name or ID of the catalog | `sandbox` |
| `limit` | No | Maximum number of consumer organizations to return | - |
| `offset` | No | Number of consumer organizations to skip before starting to return results | - |

### Example Prompts

```text
List consumer orgs
```

```text
List consumer organizations in catalog production
```

```text
List consumer orgs in catalog sandbox with limit 30
```

```text
List consumer orgs with limit 10 and offset 3 in catalog test-catalog
```

---

## CreateConsumerApp

**Tool name**: CreateConsumerApp

**Description**: Creates a new consumer application in a specific catalog in API Connect. If `consumer_org` is not provided, the application is created at the catalog level.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `title` | Yes | Title of the consumer application | - |
| `catalog` | No | Name or ID of the catalog where the application will be created | `sandbox` |
| `consumer_org` | No | Name or ID of the consumer organization that will own the application. If not provided, the application is created at the catalog level | - |
| `summary` | No | Optional description for the consumer application | - |

### Example Prompts

```text
Create a consumer app named MyApp in my-org
```

```text
Create consumer application TestApp in catalog sandbox and consumer org test-org
```

```text
Create app Production App in catalog production with consumer org prod-org with summary "Application for production environment"
```

```text
Create application WebApp in catalog sandbox
```

**Next Action Suggested**:
- List consumer app credentials after creating an application
- Subscribe to an asset using [CreateSubscriptionForPublishedAsset](#createsubscriptionforpublishedasset)

---

## ListSubscriptionsInConsumerApp

**Tool name**: ListSubscriptionsInConsumerApp

**Description**: Lists all subscriptions in a specific consumer application from API Connect. Supports pagination and optional filtering by plan name or product name. Use this tool only when a consumer application is specified in the request.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `consumer_app` | Yes | Name or ID of the consumer application | - |
| `catalog` | No | Name or ID of the catalog | `sandbox` |
| `consumer_org` | No | Name or ID of the consumer organization. Optional for catalog-scoped apps | - |
| `limit` | No | Maximum number of subscriptions to return | - |
| `offset` | No | Number of subscriptions to skip before starting to return results | - |
| `plan_name` | No | Filter subscriptions by plan name | - |
| `product_name` | No | Filter subscriptions by product name or `name:version` | - |
| `directory` | Yes | Fully qualified directory path where output files should be written | - |
| `overwrite` | No | If `true`, overwrites existing files. If `false`, skips files that already exist | `false` |

### Example Prompts

```text
List subscriptions in consumer org test-org and consumer app test-app
```

```text
List subscriptions in consumer org test-org and consumer app test-app with limit 5
```

```text
List subscriptions in catalog test-catalog and consumer org test-org and consumer app test-app
```

```text
List subscriptions in consumer app test-app and filter by plan my-plan
```

```text
List subscriptions in consumer org test-org and consumer app test-app with limit 15 and offset 5 and filter by product test-product:1.0.0
```

---

## ListSubscriptionsInACatalog

**Tool name**: ListSubscriptionsInACatalog

**Description**: Lists all subscriptions in a specific catalog from API Connect. Supports pagination and optional filtering by consumer organization, product, or plan. Use this tool when no consumer application is specified in the request.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `catalog` | No | Name or ID of the catalog | `sandbox` |
| `plan_name` | No | Filter subscriptions by plan name | - |
| `consumer_org` | No | Filter subscriptions by consumer organization name | - |
| `product_name` | No | Filter subscriptions by product name or `name:version` | - |
| `limit` | No | Maximum number of subscriptions to return | - |
| `offset` | No | Number of subscriptions to skip before starting to return results | - |

### Example Prompts

```text
List subscriptions
```

```text
List subscriptions in catalog production with limit 10
```

```text
List subscriptions in catalog sandbox and filter by plan my-plan
```

```text
List subscriptions in catalog sandbox and filter by consumer org test-org
```

```text
List subscriptions in catalog sandbox and filter by plan my-plan and consumer org test-org and product product1:1.0.0
```

---

## CreateSubscriptionForPublishedAsset

**Tool name**: CreateSubscriptionForPublishedAsset

**Description**: Creates a subscription for a published MCP Server or LLM Provider asset on the Interact Gateway. To subscribe to an MCP Server, provide only `mcpserver_name` (version defaults to `1.0.0` if omitted). To subscribe to an LLM Provider, provide only `llm_provider_name` (version defaults to `1.0.0` if omitted).

**Note**: Provide either `mcpserver_name` or `llm_provider_name` — not both.

### Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `mcpserver_name` | No | Name of the published MCP Server to subscribe to. Required when subscribing to an MCP Server — do not provide `llm_provider_name` at the same time | - |
| `mcpserver_version` | No | Version of the MCP Server | `1.0.0` |
| `llm_provider_name` | No | Name of the published LLM Provider to subscribe to. Required when subscribing to an LLM Provider — do not provide `mcpserver_name` at the same time | - |
| `llm_provider_version` | No | Version of the LLM Provider | `1.0.0` |
| `application_id` | No | Application ID of an existing consumer application | - |
| `plan_name` | No | Name of the plan to subscribe to. If the asset has only one plan, that plan is used automatically | - |
| `directory` | Yes | Fully qualified directory path where output files should be written | - |
| `overwrite` | No | If `true`, overwrites existing files. If `false`, skips files that already exist | `false` |

### Example Prompts

```text
Subscribe to MCP Server bookstore-api-mcp
```

```text
Subscribe to MCP Server bookstore-api-mcp version 2.0.0
```

```text
Subscribe to LLM provider watsonx-llm
```

```text
Subscribe to LLM provider watsonx-llm version 2.0.0
```
