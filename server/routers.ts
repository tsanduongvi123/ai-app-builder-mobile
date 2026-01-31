import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { generateAppCode, parseGeneratedCode } from "./gemini-service";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Project management routers
  projects: router({
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return db.getUserProjects(ctx.user.id);
    }),

    get: publicProcedure
      .input((input: any) => input)
      .query(async ({ ctx, input }) => {
        if (!ctx.user) return null;
        const projectId = input.projectId as number;
        return db.getProjectById(projectId, ctx.user.id);
      }),

    create: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const projectData = {
          userId: ctx.user.id,
          name: input.name || "Untitled Project",
          description: input.description || "",
          type: input.type || "utility",
          status: "draft" as const,
          aiPrompt: input.aiPrompt || "",
        };

        const projectId = await db.createProject(projectData);
        return { projectId };
      }),

    update: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const projectId = input.projectId as number;
        const updateData = input.data || {};

        await db.updateProject(projectId, ctx.user.id, updateData);
        return { success: true };
      }),

    delete: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const projectId = input.projectId as number;
        await db.deleteProject(projectId, ctx.user.id);
        return { success: true };
      }),
  }),

  // AI generation routers
  ai: router({
    generateApp: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const prompt = input.prompt as string;
        const appType = input.appType || "utility";
        
        const fullPrompt = `Create a ${appType} app with the following requirements: ${prompt}`;
        
        try {
          const generatedCode = await generateAppCode(fullPrompt);
          const parsed = parseGeneratedCode(generatedCode);
          
          return {
            success: true,
            project: parsed,
          };
        } catch (error) {
          console.error("AI generation error:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
