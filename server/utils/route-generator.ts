import type { ApiRoute } from "~/types";
import { randomUUID } from "./store";

type ProjectInput = {
  id: string;
  name: string;
  domain: string;
  context: string;
};

const stopWords = new Set([
  "api",
  "app",
  "application",
  "gestione",
  "sistema",
  "piattaforma",
  "servizio",
  "domain",
  "dominio",
]);

export function inferResource(project: ProjectInput) {
  const text = `${project.domain} ${project.name}`.toLowerCase();
  const candidates = text.match(/[a-zà-ÿ][a-zà-ÿ0-9-]{2,}/g) || [];
  const word =
    candidates.find((candidate) => !stopWords.has(candidate)) || "resources";
  const ascii = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");
  return ascii.endsWith("s") ? ascii : `${ascii}s`;
}

export function generateBaseRoutes(project: ProjectInput): ApiRoute[] {
  const resource = inferResource(project);
  const base = `/${resource}`;
  const responseSchema = JSON.stringify({
    type: "object",
    additionalProperties: true,
  });
  const listSchema = JSON.stringify({
    type: "array",
    items: { type: "object", additionalProperties: true },
  });
  const requestSchema = JSON.stringify({
    type: "object",
    additionalProperties: true,
  });
  const common = {
    projectId: project.id,
    description: `Endpoint generato dal dominio ${project.domain}.`,
    auth: "bearer" as const,
    rateLimit: 60,
    enabled: true,
  };
  return [
    {
      ...common,
      id: randomUUID(),
      method: "GET",
      path: base,
      summary: `Elenca ${resource}`,
      requestSchema: "{}",
      responseSchema: listSchema,
    },
    {
      ...common,
      id: randomUUID(),
      method: "POST",
      path: base,
      summary: `Crea una risorsa ${resource}`,
      requestSchema,
      responseSchema,
    },
    {
      ...common,
      id: randomUUID(),
      method: "GET",
      path: `${base}/:id`,
      summary: `Legge una risorsa ${resource}`,
      requestSchema: "{}",
      responseSchema,
    },
    {
      ...common,
      id: randomUUID(),
      method: "PATCH",
      path: `${base}/:id`,
      summary: `Aggiorna una risorsa ${resource}`,
      requestSchema,
      responseSchema,
    },
    {
      ...common,
      id: randomUUID(),
      method: "DELETE",
      path: `${base}/:id`,
      summary: `Elimina una risorsa ${resource}`,
      requestSchema: "{}",
      responseSchema,
    },
  ];
}
