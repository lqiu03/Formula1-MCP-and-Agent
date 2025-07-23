/**
 * Mastra MCP Configuration
 * Connects to our Formula 1 MCP server and other useful MCP servers
 */
import { MCPClient } from "@mastra/mcp";
import { z } from "zod";
export declare const mcp: MCPClient;
export declare const f1AnalysisTools: {
    analyzeDriverPerformance: import("@mastra/core/tools.js").Tool<z.ZodObject<{
        driverName: z.ZodString;
        season: z.ZodNumber;
        circuits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
        driverName: z.ZodString;
        season: z.ZodNumber;
        circuits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }>>>;
    compareDrivers: import("@mastra/core/tools.js").Tool<z.ZodObject<{
        driver1: z.ZodString;
        driver2: z.ZodString;
        season: z.ZodNumber;
        metric: z.ZodEnum<["wins", "podiums", "points", "head_to_head"]>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
        driver1: z.ZodString;
        driver2: z.ZodString;
        season: z.ZodNumber;
        metric: z.ZodEnum<["wins", "podiums", "points", "head_to_head"]>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }>>>;
    raceWeatherAnalysis: import("@mastra/core/tools.js").Tool<z.ZodObject<{
        year: z.ZodNumber;
        location: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        year: number;
        location: string;
    }, {
        year: number;
        location: string;
    }>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
        year: z.ZodNumber;
        location: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        year: number;
        location: string;
    }, {
        year: number;
        location: string;
    }>>>;
};
