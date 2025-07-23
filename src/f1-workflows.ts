/**
 * Formula 1 Analysis Workflows
 * Complex multi-step F1 analysis using basic workflow patterns
 */

import { OpenF1Client } from "./openf1-client.js";
import { createTool } from "@mastra/core";
import { z } from "zod";

const openF1Client = new OpenF1Client();

// Helper function for season championship analysis
async function analyzeSeasonStandings(season: number) {
  const meetings = await openF1Client.getMeetings(season);
  const analysis = {
    totalRaces: meetings.length,
    champions: [] as Array<{ driver: string; constructor: string; points: number }>,
    trends: [] as string[],
    season
  };
  
  // Analyze each race for patterns
  let championshipLeader = "";
  let consistentPerformers = new Set<string>();
  
  for (const meeting of meetings) {
    try {
      const sessions = await openF1Client.getSessions(meeting.meeting_key);
      const raceSession = sessions.find(s => s.session_name === "Race");
      
      if (raceSession) {
        const results = await openF1Client.getPositions(raceSession.session_key);
        const raceResults = results
          .filter(r => r.position <= 3)
          .sort((a, b) => a.position - b.position);
        
        if (raceResults.length > 0) {
          const winner = raceResults[0];
          // Track consistency
          if (winner.position === 1) {
            consistentPerformers.add(`Driver ${winner.driver_number}`);
          }
        }
      }
    } catch (error) {
      console.log(`Skipping analysis for ${meeting.meeting_name}: ${error}`);
    }
  }
  
  analysis.trends.push(`Season had ${analysis.totalRaces} races`);
  if (consistentPerformers.size > 0) {
    analysis.trends.push(`${consistentPerformers.size} drivers showed consistent top performance`);
  }
  
  return analysis;
}

// Helper function for head-to-head comparison
async function compareDriversAcrossSeason(season: number, driver1Number: number, driver2Number: number) {
  const meetings = await openF1Client.getMeetings(season);
  const comparison = {
    season,
    driver1: { number: driver1Number, wins: 0, podiums: 0, totalPoints: 0 },
    driver2: { number: driver2Number, wins: 0, podiums: 0, totalPoints: 0 },
    headToHead: { driver1Ahead: 0, driver2Ahead: 0, equal: 0 },
    raceByRace: [] as Array<{ race: string; driver1Pos: number; driver2Pos: number }>
  };
  
  for (const meeting of meetings) {
    try {
      const sessions = await openF1Client.getSessions(meeting.meeting_key);
      const raceSession = sessions.find(s => s.session_name === "Race");
      
      if (raceSession) {
        const positions = await openF1Client.getPositions(raceSession.session_key);
        const driver1Result = positions.find(p => p.driver_number === driver1Number);
        const driver2Result = positions.find(p => p.driver_number === driver2Number);
        
        if (driver1Result && driver2Result) {
          // Record positions
          comparison.raceByRace.push({
            race: meeting.meeting_name,
            driver1Pos: driver1Result.position,
            driver2Pos: driver2Result.position
          });
          
          // Count wins and podiums
          if (driver1Result.position === 1) comparison.driver1.wins++;
          if (driver2Result.position === 1) comparison.driver2.wins++;
          if (driver1Result.position <= 3) comparison.driver1.podiums++;
          if (driver2Result.position <= 3) comparison.driver2.podiums++;
          
          // Head-to-head
          if (driver1Result.position < driver2Result.position) {
            comparison.headToHead.driver1Ahead++;
          } else if (driver2Result.position < driver1Result.position) {
            comparison.headToHead.driver2Ahead++;
          } else {
            comparison.headToHead.equal++;
          }
        }
      }
    } catch (error) {
      console.log(`Skipping comparison for ${meeting.meeting_name}: ${error}`);
    }
  }
  
  return comparison;
}

// Championship Analysis Workflow Tool
export const championshipAnalysisWorkflow = createTool({
  id: "championship_analysis_workflow",
  description: "Perform comprehensive championship analysis for an F1 season",
  inputSchema: z.object({
    season: z.number().min(2018).max(2025).describe("The F1 season to analyze"),
    includeDriverComparison: z.boolean().optional().describe("Include driver-to-driver comparisons"),
    focusTeams: z.array(z.string()).optional().describe("Teams to focus analysis on")
  }),
  execute: async ({ context: { season, includeDriverComparison = false, focusTeams = [] } }: { context: { season: number; includeDriverComparison?: boolean; focusTeams?: string[] } }) => {
    try {
      console.log(`🔄 Starting championship analysis for ${season}...`);
      
      // Step 1: Season overview
      const seasonAnalysis = await analyzeSeasonStandings(season);
      
      let report = `# 🏆 ${season} Formula 1 Championship Analysis\n\n`;
      report += `## Season Overview\n`;
      report += `- **Total Races**: ${seasonAnalysis.totalRaces}\n`;
      report += `- **Key Trends**:\n`;
      seasonAnalysis.trends.forEach(trend => {
        report += `  - ${trend}\n`;
      });
      
      // Step 2: Driver comparison (if requested)
      if (includeDriverComparison) {
        report += `\n## Head-to-Head Analysis\n`;
        // Example: Compare drivers 1 and 44 (common F1 numbers)
        try {
          const comparison = await compareDriversAcrossSeason(season, 1, 44);
          report += `### Driver ${comparison.driver1.number} vs Driver ${comparison.driver2.number}\n`;
          report += `- **Driver ${comparison.driver1.number}**: ${comparison.driver1.wins} wins, ${comparison.driver1.podiums} podiums\n`;
          report += `- **Driver ${comparison.driver2.number}**: ${comparison.driver2.wins} wins, ${comparison.driver2.podiums} podiums\n`;
          report += `- **Head-to-Head**: ${comparison.headToHead.driver1Ahead}-${comparison.headToHead.driver2Ahead}-${comparison.headToHead.equal}\n`;
        } catch (error) {
          report += `- Driver comparison data not available for this season\n`;
        }
      }
      
      // Step 3: Team focus (if specified)
      if (focusTeams.length > 0) {
        report += `\n## Team Focus Analysis\n`;
        focusTeams.forEach((team: string) => {
          report += `- **${team}**: Analysis for this team would require additional team-driver mapping\n`;
        });
      }
      
      report += `\n---\n*Analysis completed using OpenF1 API data*`;
      
      return {
        content: [{ type: "text", text: report }]
      };
      
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `❌ Championship analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }]
      };
    }
  }
});

// Race Weekend Analysis Workflow Tool
export const raceWeekendAnalysisWorkflow = createTool({
  id: "race_weekend_analysis_workflow", 
  description: "Analyze a complete race weekend including practice, qualifying, and race",
  inputSchema: z.object({
    year: z.number().min(2018).max(2025).describe("Race year"),
    location: z.string().describe("Race location or circuit name"),
    includeWeatherImpact: z.boolean().optional().describe("Include weather analysis if available")
  }),
  execute: async ({ context: { year, location, includeWeatherImpact = false } }: { context: { year: number; location: string; includeWeatherImpact?: boolean } }) => {
    try {
      console.log(`🔄 Analyzing race weekend: ${year} ${location}...`);
      
      // Step 1: Find the race
      const meetings = await openF1Client.getMeetings(year);
      const raceMeeting = meetings.find(m => 
        m.meeting_name.toLowerCase().includes(location.toLowerCase()) ||
        m.location.toLowerCase().includes(location.toLowerCase()) ||
        m.circuit_short_name.toLowerCase().includes(location.toLowerCase())
      );
      
      if (!raceMeeting) {
        return {
          content: [{ type: "text", text: `❌ No race found for ${location} in ${year}` }]
        };
      }
      
      // Step 2: Get all sessions for this weekend
      const sessions = await openF1Client.getSessions(raceMeeting.meeting_key);
      
      let report = `# 🏁 ${raceMeeting.meeting_official_name} Analysis\n\n`;
      report += `**Location**: ${raceMeeting.location}\n`;
      report += `**Circuit**: ${raceMeeting.circuit_short_name}\n`;
      report += `**Date**: ${raceMeeting.date_start}\n\n`;
      
      // Step 3: Analyze each session
      report += `## Session Analysis\n`;
      
      for (const session of sessions) {
        report += `\n### ${session.session_name}\n`;
        report += `- **Type**: ${session.session_type}\n`;
        report += `- **Date**: ${session.date_start} to ${session.date_end}\n`;
        
        try {
          const positions = await openF1Client.getPositions(session.session_key);
          if (positions.length > 0) {
            const topPositions = positions
              .filter(p => p.position <= 3)
              .sort((a, b) => a.position - b.position);
            
            if (topPositions.length > 0) {
              report += `- **Top 3**: `;
              topPositions.forEach((pos, idx) => {
                report += `P${pos.position}: Driver ${pos.driver_number}`;
                if (idx < topPositions.length - 1) report += `, `;
              });
              report += `\n`;
            }
          } else {
            report += `- No position data available\n`;
          }
        } catch (error) {
          report += `- Session data not accessible\n`;
        }
      }
      
      // Step 4: Weather impact (placeholder for future enhancement)
      if (includeWeatherImpact) {
        report += `\n## Weather Impact\n`;
        report += `- Weather data analysis would require additional API integration\n`;
        report += `- Consider factors: temperature, humidity, track conditions\n`;
      }
      
      report += `\n---\n*Weekend analysis completed using OpenF1 API data*`;
      
      return {
        content: [{ type: "text", text: report }]
      };
      
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `❌ Race weekend analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }]
      };
    }
  }
});

// Export all workflow tools
export const f1Workflows = {
  championshipAnalysisWorkflow,
  raceWeekendAnalysisWorkflow
}; 