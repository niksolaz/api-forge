import { z } from "zod";
import { requireUser } from "../../utils/auth";
import { readStore, writeStore } from "../../utils/store";
const rule = z.object({
  id: z.string(),
  name: z.string().min(1),
  pattern: z.string().min(1),
  auth: z.enum(["public", "api-key", "bearer", "session"]),
  rateLimit: z.number().int().min(0),
  enabled: z.boolean(),
});
const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  database: z.enum(["sqlite", "postgresql", "supabase", "mysql"]).optional(),
  databaseUrl: z.string().optional(),
  llmProvider: z.string().optional(),
  llmApiKey: z.string().optional(),
  corsOrigins: z.array(z.string()).optional(),
  csp: z.string().optional(),
  defaultAuth: z.enum(["public", "api-key", "bearer", "session"]).optional(),
  defaultRateLimit: z.number().int().min(0).optional(),
  securityRules: z.array(rule).optional(),
});
export default defineEventHandler(async (event) => {
  const userId = requireUser(event),
    id = getRouterParam(event, "id"),
    data = schema.parse(await readBody(event)),
    store = await readStore(),
    index = store.projects.findIndex(
      (p: any) => p.id === id && p.userId === userId,
    );
  if (index < 0)
    throw createError({
      statusCode: 404,
      statusMessage: "Workspace non trovato",
    });
  const current: any = store.projects[index];
  store.projects[index] = {
    ...current,
    ...data,
    llmApiKey: data.llmApiKey || current.llmApiKey,
    databaseUrl: data.databaseUrl || current.databaseUrl,
  };
  await writeStore(store);
  const { llmApiKey, databaseUrl, ...safe }: any = store.projects[index];
  return { ...safe, hasLlmKey: !!llmApiKey, hasDatabaseUrl: !!databaseUrl };
});
