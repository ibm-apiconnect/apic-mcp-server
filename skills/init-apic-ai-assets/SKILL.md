---
name: init-apic-ai-assets
description: Initialize IBM API Connect or IBM DataPower Interactive Gateway AI assets — MCP servers and skills
---

Set up all AI assets for your IBM product in this workspace: MCP servers and agent skills. The right set of assets is determined by identifying which product the user has access to and following the appropriate installation path.

## Product Selection

Before doing anything else, ask the user which product they are working based on the below product information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Which IBM product are you setting up AI assets for?

[1] IBM API Connect (APIC)
    - Full API Connect instance (SaaS or on-prem v10/v12)
    - Sets up: MCP servers (analytics, governance, management, management-ai,
               studio, connection-composer, consumer, idig) + agent skills

[2] IBM DataPower Interactive Gateway (IDIG) — standalone / on-prem
    - Standalone IDIG deployment without a full API Connect instance
    - Sets up: idig-onprem MCP server + agent skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask for the user choice.

**Rules**:
- Wait for the user's answer before proceeding.
- If the user answers **1** (IBM API Connect), follow all steps in the `idig-apic` skill.
- If the user answers **2** (IDIG standalone / on-prem), follow all steps in the `idig-onprem` skill.
- If the user is unsure, briefly describe the difference:
  - IBM API Connect is the full API management platform — if they have an API manager URL and API keys they are an APIC user.
  - IDIG standalone is a self-contained DataPower Gateway deployment — if they only have a gateway base URL, username, and password, they are an on-prem IDIG user.
- Do not proceed to any installation steps until the product choice is confirmed.
