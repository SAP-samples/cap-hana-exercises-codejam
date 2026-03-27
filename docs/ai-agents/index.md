---
title: AI & Agents
description: Using AI coding assistants, MCP servers, and AI agents with this repository
---

## AI-Assisted Development

This repository is configured for use with AI coding assistants. The following tools are supported:

| Tool | Setup |
| --- | --- |
| Claude Code | `claude` CLI — reads `CLAUDE.md` automatically |
| GitHub Copilot | Works in VS Code and SAP BAS with free tier |
| SAP Joule | Available in SAP BAS |
| Continue | Open-source, bring-your-own-model |

## MCP Servers

The [SAP MCP servers](https://github.com/SAP/mcp-servers) provide AI tools for CAP, Fiori, UI5, and MDK development. Install them to give your AI assistant deep knowledge of SAP-specific frameworks.

```bash
# Install SAP MCP servers globally
npm install -g @sap/mcp-cap @sap/mcp-fiori
```

## Agent Instructions

The file below (`AGENT_INSTRUCTIONS.md`) contains guidance for AI agents working in this repository — safety rules, conventions, and task boundaries.

<!--@include: ../../AGENT_INSTRUCTIONS.md-->
