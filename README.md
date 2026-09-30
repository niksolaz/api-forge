# API Forge

Applicazione Nuxt full-stack per progettare API REST, configurarne sicurezza e limiti, e generare documentazione OpenAPI 3.1.

## Avvio

```bash
cp .env.example .env
npm install
npm run dev
```

Apri `http://localhost:3000`, crea un account e completa l'onboarding. I dati del builder sono salvati localmente in `server/data/store.json` (ignorato da Git).

## Funzioni incluse

- signup, signin e signout con sessione firmata in cookie HttpOnly;
- configurazione contesto, dominio, LLM, database e credenziali;
- provider database: SQLite, PostgreSQL, Supabase e MySQL;
- CRUD rotte con metodo, path, JSON Schema, auth e rate limit;
- configurazione CORS e CSP per progetto;
- documento OpenAPI 3.1 generato dinamicamente;
- export `GET /api/export/:projectId` di un server Fastify ZIP con Swagger UI e adapter database;
- interfaccia responsive Nuxt 4.

## Architettura adapter prevista per il server generato

Il modello di dominio usa un contratto repository indipendente dal database. Ogni provider implementa lo stesso adapter (`SQLiteAdapter`, `PostgresAdapter`, `SupabaseAdapter`, `MySQLAdapter`) e viene selezionato tramite configurazione, senza cambiare controller o servizi applicativi.

## Nota sicurezza

La demo persiste le credenziali di progetto lato server per rendere completo il flusso locale. Prima della produzione collegare un secret manager/KMS e cifrare `llmApiKey` e `databaseUrl` at-rest. Impostare sempre `NUXT_SESSION_SECRET` con un valore casuale robusto.
