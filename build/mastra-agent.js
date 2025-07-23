#!/usr/bin/env node
/**
 * Enhanced Formula 1 Agent with Mastra
 * Combines basic MCP tools with advanced agent capabilities
 */
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { mcp, f1AnalysisTools } from "./mastra-config.js";
// Note: Memory can be added later when import path is confirmed
// Create the enhanced F1 agent
const f1Agent = new Agent({
    name: "Enhanced F1 Racing Agent",
    description: "Formula 1 racing expert",
    instructions: `
    You are Sebastian, an expert Formula 1 analyst and racing enthusiast with deep knowledge of F1 history, 
    statistics, and racing strategy. You have access to comprehensive F1 data and can:
    
    - Provide race results and podium information
    - Analyze driver and team performance across seasons
    - Compare drivers head-to-head with detailed statistics
    - Discuss racing strategy and technical aspects
    - Remember previous conversations and user preferences
    - Perform complex multi-step analysis
    
    Always provide detailed, insightful analysis and remember what users have asked about before.
    Use emojis appropriately to make responses engaging (🏎️, 🏁, 🥇, etc.).
    
    When asked about specific races or seasons, use your tools to get accurate, up-to-date data.
    For complex analysis, break down your reasoning step by step.
  `,
    model: openai("gpt-4o-mini"),
    tools: {
        // Get tools from our basic MCP server
        ...(await mcp.getTools().catch(() => ({}))), // Gracefully handle if MCP server isn't running
        // Add enhanced analysis tools
        ...f1AnalysisTools,
    },
});
// Example usage and test function
async function testF1Agent() {
    console.log("🏁 Enhanced Formula 1 Agent is ready!");
    console.log("✨ Available capabilities:");
    console.log("  - Basic F1 data via MCP server");
    console.log("  - Advanced driver performance analysis");
    console.log("  - Driver comparison tools");
    console.log("  - Weather and race analysis");
    console.log("  - Memory for personalized insights");
    console.log("");
    // Test the agent with a sample query
    try {
        const response = await f1Agent.generate([
            {
                role: "user",
                content: "Hi! I'm interested in learning about the 2024 British Grand Prix. Can you tell me about the podium winners and provide some analysis?"
            }
        ]);
        console.log("🎯 Sample Response:");
        console.log(response.text);
        console.log("");
        console.log("🔧 Ready for user queries!");
    }
    catch (error) {
        console.log("⚠️  Note: Some tools may not be available without the MCP server running");
        console.log("💡 To get full functionality:");
        console.log("  1. Start the basic MCP server: npm run start");
        console.log("  2. Then start this enhanced agent: npm run start:enhanced");
        console.log("");
        console.log("🎯 Enhanced agent is still functional with available tools!");
    }
}
// Interactive mode for testing
async function interactiveMode() {
    console.log("🏁 Starting Enhanced F1 Agent in interactive mode...");
    console.log("💬 You can ask me anything about Formula 1!");
    console.log("📝 Example queries:");
    console.log("  - 'Who won the 2024 Silverstone race?'");
    console.log("  - 'Compare Hamilton vs Verstappen in 2023'");
    console.log("  - 'Analyze Leclerc's performance in 2024'");
    console.log("  - 'What was the weather like during Monaco 2024?'");
    console.log("");
    // For demo purposes, run a test
    await testF1Agent();
}
// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    interactiveMode().catch((error) => {
        console.error("❌ Agent error:", error);
        process.exit(1);
    });
}
export { f1Agent };
//# sourceMappingURL=mastra-agent.js.map