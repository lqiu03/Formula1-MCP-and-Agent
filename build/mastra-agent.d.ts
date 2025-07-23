#!/usr/bin/env node
/**
 * Enhanced Formula 1 Agent with Mastra
 * Combines basic MCP tools with advanced agent capabilities
 */
import { Agent } from "@mastra/core";
declare const f1Agent: Agent<"Enhanced F1 Racing Agent", {
    analyzeDriverPerformance: import("@mastra/core/tools.js").Tool<import("zod").ZodObject<{
        driverName: import("zod").ZodString;
        season: import("zod").ZodNumber;
        circuits: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }>, undefined, import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
        driverName: import("zod").ZodString;
        season: import("zod").ZodNumber;
        circuits: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }, {
        season: number;
        driverName: string;
        circuits?: string[] | undefined;
    }>>>;
    compareDrivers: import("@mastra/core/tools.js").Tool<import("zod").ZodObject<{
        driver1: import("zod").ZodString;
        driver2: import("zod").ZodString;
        season: import("zod").ZodNumber;
        metric: import("zod").ZodEnum<["wins", "podiums", "points", "head_to_head"]>;
    }, "strip", import("zod").ZodTypeAny, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }, {
        season: number;
        driver1: string;
        driver2: string;
        metric: "wins" | "podiums" | "points" | "head_to_head";
    }>, undefined, import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
        driver1: import("zod").ZodString;
        driver2: import("zod").ZodString;
        season: import("zod").ZodNumber;
        metric: import("zod").ZodEnum<["wins", "podiums", "points", "head_to_head"]>;
    }, "strip", import("zod").ZodTypeAny, {
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
    raceWeatherAnalysis: import("@mastra/core/tools.js").Tool<import("zod").ZodObject<{
        year: import("zod").ZodNumber;
        location: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        year: number;
        location: string;
    }, {
        year: number;
        location: string;
    }>, undefined, import("@mastra/core").ToolExecutionContext<import("zod").ZodObject<{
        year: import("zod").ZodNumber;
        location: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        year: number;
        location: string;
    }, {
        year: number;
        location: string;
    }>>>;
}, Record<string, import("@mastra/core").Metric>>;
export { f1Agent };
