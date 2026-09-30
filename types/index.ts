export type DatabaseProvider = "sqlite" | "postgresql" | "supabase" | "mysql";
export type AuthMode = "public" | "api-key" | "bearer" | "session";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface AuthUser { id: string; email: string }
export interface SecurityRule {
  id: string;
  name: string;
  pattern: string;
  auth: AuthMode;
  rateLimit: number;
  enabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  context: string;
  domain: string;
  llmProvider: string;
  llmApiKey?: string;
  database: DatabaseProvider;
  databaseUrl?: string;
  corsOrigins: string[];
  csp: string;
  defaultAuth?: AuthMode;
  defaultRateLimit?: number;
  securityRules?: SecurityRule[];
  createdAt: string;
}

export interface ApiRoute {
  id: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  auth: AuthMode;
  rateLimit: number;
  requestSchema: string;
  responseSchema: string;
  enabled: boolean;
}
