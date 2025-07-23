#!/usr/bin/env node
/**
 * Formula 1 MCP Server
 * Provides access to Formula 1 race data via OpenF1 API
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { OpenF1Client } from "./openf1-client.js";
const server = new McpServer({
    name: "formula1-mcp",
    version: "1.0.0"
});
const openF1Client = new OpenF1Client();
// Helper function to format race results
function formatRaceResults(results, title) {
    if (!results || results.length === 0) {
        return "No results found for this race.";
    }
    let output = `🏁 **${title}**\n\n`;
    results.forEach((result, index) => {
        const positionEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${result.position}.`;
        output += `${positionEmoji} **${result.driver.full_name}** (${result.driver.name_acronym}) - ${result.driver.team_name}\n`;
    });
    return output;
}
// Helper function to format podium specifically
function formatPodium(podium, raceInfo) {
    if (!podium || podium.length === 0) {
        return `No podium results found for ${raceInfo}.`;
    }
    let output = `🏆 **${raceInfo} - Podium Winners**\n\n`;
    const emojis = ["🥇", "🥈", "🥉"];
    const positions = ["1st Place", "2nd Place", "3rd Place"];
    podium.forEach((result, index) => {
        if (index < 3) {
            output += `${emojis[index]} **${positions[index]}**: ${result.driver.full_name} (${result.driver.name_acronym})\n`;
            output += `   Team: ${result.driver.team_name}\n`;
            output += `   Country: ${result.driver.country_code}\n\n`;
        }
    });
    return output;
}
// Tool: Get Podium Winners
server.registerTool("get_podium_winners", {
    title: "Get F1 Podium Winners",
    description: "Get the podium winners (top 3 finishers) for a Formula 1 Grand Prix",
    inputSchema: {
        year: z.number().min(2018).max(2025).describe("The year of the race (2018-2025)"),
        location: z.string().describe("The race location (e.g., 'Silverstone', 'Monaco', 'Monza', 'Spa')")
    }
}, async ({ year, location }) => {
    try {
        const podium = await openF1Client.getPodiumWinners(year, location);
        if (!podium) {
            return {
                content: [{
                        type: "text",
                        text: `❌ Could not find race results for ${location} ${year}. Please check the spelling and ensure the race has taken place.`
                    }]
            };
        }
        const raceInfo = `${location} ${year} Grand Prix`;
        const formattedPodium = formatPodium(podium, raceInfo);
        return {
            content: [{
                    type: "text",
                    text: formattedPodium
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `❌ Error fetching podium winners: ${error}`
                }],
            isError: true
        };
    }
});
// Tool: Get Full Race Results
server.registerTool("get_race_results", {
    title: "Get F1 Race Results",
    description: "Get the complete race results for a Formula 1 Grand Prix",
    inputSchema: {
        year: z.number().min(2018).max(2025).describe("The year of the race (2018-2025)"),
        location: z.string().describe("The race location (e.g., 'Silverstone', 'Monaco', 'Monza', 'Spa')"),
        top_n: z.number().optional().default(10).describe("Number of top results to show (default: 10)")
    }
}, async ({ year, location, top_n }) => {
    try {
        // Find the meeting
        const meetings = await openF1Client.getMeetings(year, location);
        if (meetings.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `❌ Could not find race for ${location} ${year}. Please check the spelling and ensure the race has taken place.`
                    }]
            };
        }
        const meeting = meetings[0];
        // Find the race session
        const raceSession = await openF1Client.getRaceSession(meeting.meeting_key);
        if (!raceSession) {
            return {
                content: [{
                        type: "text",
                        text: `❌ Could not find race session for ${meeting.meeting_name} ${year}.`
                    }]
            };
        }
        // Get race results
        const results = await openF1Client.getRaceResults(raceSession.session_key);
        const topResults = results.slice(0, top_n);
        const raceInfo = `${meeting.meeting_name} ${year} - Full Race Results`;
        const formattedResults = formatRaceResults(topResults, raceInfo);
        return {
            content: [{
                    type: "text",
                    text: formattedResults
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `❌ Error fetching race results: ${error}`
                }],
            isError: true
        };
    }
});
// Tool: List Available Races
server.registerTool("list_races", {
    title: "List F1 Races",
    description: "List all Formula 1 races for a given year",
    inputSchema: {
        year: z.number().min(2018).max(2025).describe("The year to list races for (2018-2025)")
    }
}, async ({ year }) => {
    try {
        const meetings = await openF1Client.getMeetings(year);
        if (meetings.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `❌ No races found for ${year}.`
                    }]
            };
        }
        let output = `🏎️ **Formula 1 ${year} Race Calendar**\n\n`;
        meetings.forEach((meeting, index) => {
            const date = new Date(meeting.date_start).toLocaleDateString();
            output += `${index + 1}. **${meeting.meeting_name}** - ${meeting.location}\n`;
            output += `   📅 ${date} | 🏁 ${meeting.circuit_short_name}\n\n`;
        });
        return {
            content: [{
                    type: "text",
                    text: output
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `❌ Error fetching races: ${error}`
                }],
            isError: true
        };
    }
});
// Resource: Current Season Overview
server.registerResource("current_season", "f1://season/current", {
    title: "Current F1 Season",
    description: "Overview of the current Formula 1 season",
    mimeType: "text/plain"
}, async (uri) => {
    try {
        const currentYear = new Date().getFullYear();
        const meetings = await openF1Client.getMeetings(currentYear);
        let content = `🏎️ Formula 1 ${currentYear} Season\n\n`;
        content += `Total Races: ${meetings.length}\n\n`;
        content += "Race Calendar:\n";
        meetings.forEach((meeting, index) => {
            const date = new Date(meeting.date_start).toLocaleDateString();
            content += `${index + 1}. ${meeting.meeting_name} - ${date}\n`;
        });
        return {
            contents: [{
                    uri: uri.href,
                    text: content
                }]
        };
    }
    catch (error) {
        return {
            contents: [{
                    uri: uri.href,
                    text: `Error loading current season: ${error}`
                }]
        };
    }
});
// Prompt: Ask for Race Results
server.registerPrompt("ask_race_results", {
    title: "Ask for F1 Race Results",
    description: "Generate a prompt to ask about Formula 1 race results",
    argsSchema: {
        year: z.string().describe("The year of the race"),
        location: z.string().describe("The race location")
    }
}, ({ year, location }) => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Can you get me the podium winners for the ${location} ${year} Grand Prix? I'm particularly interested in who finished in the top 3 positions.`
            }
        }]
}));
// Prompt: Compare Race Results
server.registerPrompt("compare_races", {
    title: "Compare F1 Races",
    description: "Generate a prompt to compare results between different races",
    argsSchema: {
        year1: z.string().describe("First race year"),
        location1: z.string().describe("First race location"),
        year2: z.string().describe("Second race year"),
        location2: z.string().describe("Second race location")
    }
}, ({ year1, location1, year2, location2 }) => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `I'd like to compare the race results between the ${location1} ${year1} Grand Prix and the ${location2} ${year2} Grand Prix. Can you get the podium winners for both races and tell me about any interesting patterns or differences?`
            }
        }]
}));
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🏁 Formula 1 MCP Server is running!");
    console.error("Available tools:");
    console.error("  - get_podium_winners: Get top 3 finishers for a race");
    console.error("  - get_race_results: Get full race results");
    console.error("  - list_races: List all races for a year");
    console.error("Ready to provide F1 race data! 🏎️");
}
main().catch((error) => {
    console.error("❌ Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map