import { z } from "zod";
import { requireUser } from "../../utils/auth";
import { randomUUID, readStore, writeStore } from "../../utils/store";
import { generateBaseRoutes } from "../../utils/route-generator";
import { encryptSecret } from "../../utils/secrets";
const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  context: z.string().min(10),
  domain: z.string().min(2),
  llmProvider: z.string(),
  llmApiKey: z.string().min(5),
  database: z.enum(["sqlite", "postgresql", "supabase", "mysql"]),
  databaseUrl: z.string().optional(),
  corsOrigins: z.array(z.string()).default(["http://localhost:3000"]),
  csp: z.string().default("default-src 'self'"),
});
export default defineEventHandler(async (event) => {
  const userId = requireUser(event);
  const data = schema.parse(await readBody(event));
  const store = await readStore();
  const project = {
    ...data,
    llmApiKey: encryptSecret(data.llmApiKey),
    databaseUrl: encryptSecret(data.databaseUrl),
    id: randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };
  store.projects.push(project as any);
  store.routes.push(...generateBaseRoutes(project));
  await writeStore(store);
  return { ...project, llmApiKey: undefined, databaseUrl: undefined };
});
