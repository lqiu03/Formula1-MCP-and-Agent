import { MCPServer } from "@mastra/mcp";
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { f1AnalysisTools, mcp } from "./mastra-config.js";

(async () => {
  // Build the enhanced agent (no console banner output)
  const enhancedAgent = new Agent({
    name: "Enhanced F1 Agent",
    description: "Advanced Formula 1 analysis agent with extra tools",
    instructions: `You are a knowledgeable Formula 1 analyst. Use available tools to provide race results, driver analysis, and season insights.`,
    model: openai("gpt-4o-mini"),
    tools: {
      ...(await mcp.getTools().catch(() => ({}))),
      ...f1AnalysisTools,
    },
  });

  // Wrap the agent & tools in an MCPServer
  const server = new MCPServer({
    name: "formula1-enhanced",
    version: "1.0.0",
    agents: { enhancedAgent },
    tools: f1AnalysisTools,
  });

  await server.startStdio();
})(); 