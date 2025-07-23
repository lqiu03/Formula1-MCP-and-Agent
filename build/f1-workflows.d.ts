/**
 * Formula 1 Analysis Workflows
 * Complex multi-step F1 analysis using basic workflow patterns
 */
import { z } from "zod";
export declare const championshipAnalysisWorkflow: import("@mastra/core/tools.js").Tool<z.ZodObject<{
    season: z.ZodNumber;
    includeDriverComparison: z.ZodOptional<z.ZodBoolean>;
    focusTeams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    season: number;
    includeDriverComparison?: boolean | undefined;
    focusTeams?: string[] | undefined;
}, {
    season: number;
    includeDriverComparison?: boolean | undefined;
    focusTeams?: string[] | undefined;
}>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
    season: z.ZodNumber;
    includeDriverComparison: z.ZodOptional<z.ZodBoolean>;
    focusTeams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    season: number;
    includeDriverComparison?: boolean | undefined;
    focusTeams?: string[] | undefined;
}, {
    season: number;
    includeDriverComparison?: boolean | undefined;
    focusTeams?: string[] | undefined;
}>>>;
export declare const raceWeekendAnalysisWorkflow: import("@mastra/core/tools.js").Tool<z.ZodObject<{
    year: z.ZodNumber;
    location: z.ZodString;
    includeWeatherImpact: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    year: number;
    location: string;
    includeWeatherImpact?: boolean | undefined;
}, {
    year: number;
    location: string;
    includeWeatherImpact?: boolean | undefined;
}>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
    year: z.ZodNumber;
    location: z.ZodString;
    includeWeatherImpact: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    year: number;
    location: string;
    includeWeatherImpact?: boolean | undefined;
}, {
    year: number;
    location: string;
    includeWeatherImpact?: boolean | undefined;
}>>>;
export declare const f1Workflows: {
    championshipAnalysisWorkflow: import("@mastra/core/tools.js").Tool<z.ZodObject<{
        season: z.ZodNumber;
        includeDriverComparison: z.ZodOptional<z.ZodBoolean>;
        focusTeams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        includeDriverComparison?: boolean | undefined;
        focusTeams?: string[] | undefined;
    }, {
        season: number;
        includeDriverComparison?: boolean | undefined;
        focusTeams?: string[] | undefined;
    }>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
        season: z.ZodNumber;
        includeDriverComparison: z.ZodOptional<z.ZodBoolean>;
        focusTeams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        season: number;
        includeDriverComparison?: boolean | undefined;
        focusTeams?: string[] | undefined;
    }, {
        season: number;
        includeDriverComparison?: boolean | undefined;
        focusTeams?: string[] | undefined;
    }>>>;
    raceWeekendAnalysisWorkflow: import("@mastra/core/tools.js").Tool<z.ZodObject<{
        year: z.ZodNumber;
        location: z.ZodString;
        includeWeatherImpact: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        year: number;
        location: string;
        includeWeatherImpact?: boolean | undefined;
    }, {
        year: number;
        location: string;
        includeWeatherImpact?: boolean | undefined;
    }>, undefined, import("@mastra/core").ToolExecutionContext<z.ZodObject<{
        year: z.ZodNumber;
        location: z.ZodString;
        includeWeatherImpact: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        year: number;
        location: string;
        includeWeatherImpact?: boolean | undefined;
    }, {
        year: number;
        location: string;
        includeWeatherImpact?: boolean | undefined;
    }>>>;
};
