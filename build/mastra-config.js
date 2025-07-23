/**
 * Mastra MCP Configuration
 * Connects to our Formula 1 MCP server and other useful MCP servers
 */
import { MCPClient } from "@mastra/mcp";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { OpenF1Client } from "./openf1-client.js";
// Initialize our OpenF1 client for direct API access when needed
const openF1Client = new OpenF1Client();
// Configure MCPClient to connect to our F1 server and other useful servers
export const mcp = new MCPClient({
    servers: {
        // Our Formula 1 MCP server (absolute paths to avoid cwd issues)
        formula1: {
            command: "/Users/lucasqiu/.nvm/versions/node/v20.19.4/bin/node",
            args: ["/Users/lucasqiu/Desktop/Formula1-MCP/build/index.js"],
        },
    },
});
// Enhanced tools that complement our basic MCP server
export const f1AnalysisTools = {
    analyzeDriverPerformance: createTool({
        id: "analyze_driver_performance",
        inputSchema: z.object({
            driverName: z.string().describe("Name of the F1 driver to analyze"),
            season: z.number().describe("Season year to analyze"),
            circuits: z.array(z.string()).optional().describe("Specific circuits to focus on"),
        }),
        description: "Analyze a driver's performance across multiple races in a season",
        execute: async ({ context: { driverName, season, circuits } }) => {
            try {
                const meetings = await openF1Client.getMeetings(season);
                let analysis = `🏎️ **${driverName} Performance Analysis - ${season} Season**\n\n`;
                let analyzedRaces = 0;
                let totalPoints = 0;
                let podiums = 0;
                let wins = 0;
                for (const meeting of meetings) {
                    // Filter by circuits if specified
                    if (circuits && circuits.length > 0) {
                        const circuitMatch = circuits.some(circuit => meeting.location.toLowerCase().includes(circuit.toLowerCase()) ||
                            meeting.circuit_short_name.toLowerCase().includes(circuit.toLowerCase()));
                        if (!circuitMatch)
                            continue;
                    }
                    const raceSession = await openF1Client.getRaceSession(meeting.meeting_key);
                    if (!raceSession)
                        continue;
                    const results = await openF1Client.getRaceResults(raceSession.session_key);
                    const driverResult = results.find(r => r.driver.full_name.toLowerCase().includes(driverName.toLowerCase()) ||
                        r.driver.last_name.toLowerCase().includes(driverName.toLowerCase()));
                    if (driverResult) {
                        analyzedRaces++;
                        analysis += `📍 **${meeting.meeting_name}**: P${driverResult.position}\n`;
                        // Calculate points (simplified F1 points system)
                        const points = driverResult.position <= 10 ?
                            [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][driverResult.position - 1] || 0 : 0;
                        totalPoints += points;
                        if (driverResult.position <= 3)
                            podiums++;
                        if (driverResult.position === 1)
                            wins++;
                    }
                }
                analysis += `\n**Season Summary:**\n`;
                analysis += `- Races Analyzed: ${analyzedRaces}\n`;
                analysis += `- Total Points: ${totalPoints}\n`;
                analysis += `- Podiums: ${podiums}\n`;
                analysis += `- Wins: ${wins}\n`;
                analysis += `- Average Position: ${analyzedRaces > 0 ? (totalPoints / analyzedRaces).toFixed(1) : 'N/A'}\n`;
                return analysis;
            }
            catch (error) {
                return `❌ Error analyzing driver performance: ${error}`;
            }
        },
    }),
    compareDrivers: createTool({
        id: "compare_drivers",
        inputSchema: z.object({
            driver1: z.string().describe("First driver to compare"),
            driver2: z.string().describe("Second driver to compare"),
            season: z.number().describe("Season year for comparison"),
            metric: z.enum(["wins", "podiums", "points", "head_to_head"]).describe("Comparison metric"),
        }),
        description: "Compare two drivers' performance in a given season",
        execute: async ({ context: { driver1, driver2, season, metric } }) => {
            try {
                const meetings = await openF1Client.getMeetings(season);
                let comparison = `🆚 **Driver Comparison: ${driver1} vs ${driver2} (${season})**\n\n`;
                const driver1Stats = { wins: 0, podiums: 0, points: 0, positions: [] };
                const driver2Stats = { wins: 0, podiums: 0, points: 0, positions: [] };
                let headToHead = { driver1: 0, driver2: 0 };
                for (const meeting of meetings) {
                    const raceSession = await openF1Client.getRaceSession(meeting.meeting_key);
                    if (!raceSession)
                        continue;
                    const results = await openF1Client.getRaceResults(raceSession.session_key);
                    const d1Result = results.find(r => r.driver.full_name.toLowerCase().includes(driver1.toLowerCase()) ||
                        r.driver.last_name.toLowerCase().includes(driver1.toLowerCase()));
                    const d2Result = results.find(r => r.driver.full_name.toLowerCase().includes(driver2.toLowerCase()) ||
                        r.driver.last_name.toLowerCase().includes(driver2.toLowerCase()));
                    if (d1Result && d2Result) {
                        // Calculate stats for driver 1
                        driver1Stats.positions.push(d1Result.position);
                        const d1Points = d1Result.position <= 10 ?
                            [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][d1Result.position - 1] || 0 : 0;
                        driver1Stats.points += d1Points;
                        if (d1Result.position === 1)
                            driver1Stats.wins++;
                        if (d1Result.position <= 3)
                            driver1Stats.podiums++;
                        // Calculate stats for driver 2
                        driver2Stats.positions.push(d2Result.position);
                        const d2Points = d2Result.position <= 10 ?
                            [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][d2Result.position - 1] || 0 : 0;
                        driver2Stats.points += d2Points;
                        if (d2Result.position === 1)
                            driver2Stats.wins++;
                        if (d2Result.position <= 3)
                            driver2Stats.podiums++;
                        // Head-to-head
                        if (d1Result.position < d2Result.position) {
                            headToHead.driver1++;
                        }
                        else if (d2Result.position < d1Result.position) {
                            headToHead.driver2++;
                        }
                    }
                }
                comparison += `**${driver1}:**\n`;
                comparison += `- Wins: ${driver1Stats.wins}\n`;
                comparison += `- Podiums: ${driver1Stats.podiums}\n`;
                comparison += `- Points: ${driver1Stats.points}\n`;
                comparison += `- Avg Position: ${(driver1Stats.positions.reduce((a, b) => a + b, 0) / driver1Stats.positions.length).toFixed(1)}\n\n`;
                comparison += `**${driver2}:**\n`;
                comparison += `- Wins: ${driver2Stats.wins}\n`;
                comparison += `- Podiums: ${driver2Stats.podiums}\n`;
                comparison += `- Points: ${driver2Stats.points}\n`;
                comparison += `- Avg Position: ${(driver2Stats.positions.reduce((a, b) => a + b, 0) / driver2Stats.positions.length).toFixed(1)}\n\n`;
                comparison += `**Head-to-Head:** ${driver1} ${headToHead.driver1} - ${headToHead.driver2} ${driver2}\n`;
                return comparison;
            }
            catch (error) {
                return `❌ Error comparing drivers: ${error}`;
            }
        },
    }),
    raceWeatherAnalysis: createTool({
        id: "race_weather_analysis",
        inputSchema: z.object({
            year: z.number().describe("Year of the race"),
            location: z.string().describe("Race location"),
        }),
        description: "Analyze weather conditions during a race and their impact on results",
        execute: async ({ context: { year, location } }) => {
            try {
                const meetings = await openF1Client.getMeetings(year, location);
                if (meetings.length === 0) {
                    return `❌ No race found for ${location} ${year}`;
                }
                const meeting = meetings[0];
                const raceSession = await openF1Client.getRaceSession(meeting.meeting_key);
                if (!raceSession) {
                    return `❌ No race session found for ${meeting.meeting_name}`;
                }
                // Get weather data (this would require extending OpenF1Client to fetch weather)
                let analysis = `🌤️ **Weather Analysis: ${meeting.meeting_name} ${year}**\n\n`;
                analysis += `📅 Race Date: ${new Date(raceSession.date_start).toLocaleDateString()}\n`;
                analysis += `🏁 Circuit: ${meeting.circuit_short_name}\n`;
                analysis += `📍 Location: ${meeting.location}\n\n`;
                // Get race results for context
                const results = await openF1Client.getRaceResults(raceSession.session_key);
                const podium = results.slice(0, 3);
                analysis += `**Race Results (Top 3):**\n`;
                podium.forEach((result, index) => {
                    const emoji = ["🥇", "🥈", "🥉"][index];
                    analysis += `${emoji} ${result.driver.full_name} (${result.driver.team_name})\n`;
                });
                analysis += `\n*Note: Weather data integration can be enhanced with specific OpenF1 weather endpoints*`;
                return analysis;
            }
            catch (error) {
                return `❌ Error analyzing race weather: ${error}`;
            }
        },
    }),
};
//# sourceMappingURL=mastra-config.js.map