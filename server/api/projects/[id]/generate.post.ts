import { requireUser } from "../../../utils/auth";
import { generateBaseRoutes } from "../../../utils/route-generator";
import { readStore, writeStore } from "../../../utils/store";

export default defineEventHandler(async (event) => {
  const userId = requireUser(event);
  const id = getRouterParam(event, "id");
  const store = await readStore();
  const project: any = store.projects.find(
    (item: any) => item.id === id && item.userId === userId,
  );
  if (!project)
    throw createError({
      statusCode: 404,
      statusMessage: "Workspace non trovato",
    });
  const existing = new Set(
    store.routes
      .filter((route) => route.projectId === id)
      .map((route) => `${route.method}:${route.path}`),
  );
  const generated = generateBaseRoutes(project).filter(
    (route) => !existing.has(`${route.method}:${route.path}`),
  );
  store.routes.push(...generated);
  await writeStore(store);
  return { created: generated.length, routes: generated };
});
