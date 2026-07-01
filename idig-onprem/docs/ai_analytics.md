# Analytics AI LLM

## Tool Details

**Tool name**: GetAnalyticsAILLM

**Description**: Provides insights into AI LLM usage and analytics within IDIG. Track token consumption, measure AI model popularity, monitor consumer organizations and applications, and analyze performance metrics.

## Supported Operations

- `total_consumer_orgs` - Total consumer organizations using AI LLM
- `total_requests` - Total AI LLM requests
- `total_tokens` - Total token consumption
- `token_count_over_time` - Token usage trends over time
- `top_consumers_by_token_over_time` - Top consumers by token usage over time
- `top_consumers_by_token` - Top consumers by total token usage
- `top_apps_by_token_over_time` - Top apps by token usage over time
- `top_apps_by_token` - Top apps by total token usage
- `model_usage` - AI model usage distribution
- `cache_hits_over_time` - Cache hit rate trends
- `top_apps_rate_limited` - Apps experiencing rate limiting
- `response_time_percentiles` - Response time distribution
- `request_token_count_percentiles` - Request token count distribution
- `response_token_count_percentiles` - Response token count distribution

## Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `userPrompt` | Yes | Question about AI LLM usage analytics | - |
| `operation` | No | Analytics operation to perform | `total_tokens` |
| `chart` | No | Chart type (`bar`, `line`, `pie`, `donut`, `area`, `gauge`, `yes`, `no`) | `no` |
| `dateNum` | No | Number of time units to look back | - |
| `dateCategory` | No | Time unit (`years`, `quarters`, `months`, `weeks`, `days`, `hours`, `minutes`) | - |
| `startDay` | No | Start date (`YYYY-MM-DD`) | - |
| `endDay` | No | End date (`YYYY-MM-DD`) | - |
| `startTime` | No | Start time (`HH:mm:ss`) | - |
| `endTime` | No | End time (`HH:mm:ss`) | - |
| `query` | No | Filter parameters (`status_code`, `method`, `api_name`, etc.) | `""` |

## Example Prompts

```text
How many total tokens were consumed this week
```

```text
Which consumer organizations are using the most tokens
```

```text
Show me the AI model usage distribution as a pie chart
```

```text
What is the token usage over time this week? Show a chart
```

```text
Show me token usage for successful GET requests
```

```text
Token usage trends in the test catalog
```

```text
What was the cache hit rate today?
```

```text
Which applications are being rate limited the most

```

# Analytics MCP

## Tool Details

**Tool name**: GetAnalyticsMCP

**Description**: Provides insights into MCP (Model Context Protocol) usage and analytics within IDIG standalone. Track MCP call volumes, measure tool popularity, monitor consumer organizations and products using MCP services.

## Supported Operations

- `total_consumer_orgs` - Total consumer organizations using MCP
- `total_requests` - Total MCP requests
- `total_mcp_servers` - Total registered MCP servers
- `mcp_calls_over_time` - MCP call volume trends over time
- `top_mcp_servers_over_time` - Top MCP servers by usage over time
- `tool_distribution` - Distribution of MCP tools being used
- `top_consumers_over_time` - Top consumer organizations using MCP over time

## Parameters

| Parameter | Required | Description | Default |
| --------- | -------- | ----------- | ------- |
| `userPrompt` | Yes | Question about MCP usage analytics | - |
| `operation` | No | Analytics operation to perform | `total_requests` |
| `chart` | No | Chart type (`bar`, `line`, `pie`, `donut`, `area`, `gauge`, `yes`, `no`) | `no` |
| `dateNum` | No | Number of time units to look back | - |
| `dateCategory` | No | Time unit (`years`, `quarters`, `months`, `weeks`, `days`, `hours`, `minutes`) | - |
| `startDay` | No | Start date (`YYYY-MM-DD`) | - |
| `endDay` | No | End date (`YYYY-MM-DD`) | - |
| `startTime` | No | Start time (`HH:mm:ss`) | - |
| `endTime` | No | End time (`HH:mm:ss`) | - |
| `query` | No | Filter parameters (`status_code`, `method`, `api_name`, `consumer_org_name`, etc.) | `""` |
| `catalog` | No | API Connect catalog name/ID | `sandbox` |
| `space` | No | API Connect space name/ID | - |

## Example Prompts

```text
How many consumer organizations are using MCP
```

```text
How many total MCP requests were made
```

```text
How many MCP servers are registered
```

```text
What is the MCP call volume over time this month
```

```text
Show me MCP calls over the past 30 days as a line chart
```

```text
Which MCP servers are being used the most
```

```text
What is the distribution of MCP tools being used
```

```text
Show me MCP tool distribution as a pie chart
```

```text
Which consumer organizations are using MCP the most
```

```text
Show me top consumers using MCP over time
```
