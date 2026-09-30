import type { ApiRoute, Project } from "~/types";
export function buildOpenApi(project: Project, routes: ApiRoute[]) {
  const paths: Record<string, any> = {};
  for (const route of routes.filter((r) => r.enabled)) {
    const path = route.path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
    paths[path] ||= {};
    let request: any = {};
    let response: any = {};
    try {
      request = JSON.parse(route.requestSchema || "{}");
      response = JSON.parse(route.responseSchema || "{}");
    } catch {}
    paths[path][route.method.toLowerCase()] = {
      summary: route.summary,
      description: route.description,
      security:
        route.auth === "public"
          ? []
          : [{ [route.auth === "api-key" ? "ApiKeyAuth" : "BearerAuth"]: [] }],
      ...(route.method !== "GET" && route.method !== "DELETE"
        ? {
            requestBody: {
              required: true,
              content: { "application/json": { schema: request } },
            },
          }
        : {}),
      responses: {
        "200": {
          description: "Operazione completata",
          content: { "application/json": { schema: response } },
        },
        "429": { description: "Rate limit superato" },
      },
      "x-rate-limit": route.rateLimit,
    };
  }
  return {
    openapi: "3.1.0",
    info: {
      title: project.name,
      version: "1.0.0",
      description: project.description,
    },
    servers: [{ url: "http://localhost:4000" }],
    paths,
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  };
}
