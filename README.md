# API Forge

Applicazione Nuxt full-stack per progettare API REST, configurarne sicurezza e limiti, e generare documentazione OpenAPI 3.1.

## Avvio

```bash
cp .env.example .env
npm install
npm run dev
```

Apri `http://localhost:3000`, crea un account e completa l'onboarding. I dati del builder sono salvati localmente in `server/data/store.json` (ignorato da Git).

Genera due secret diversi per `.env`:

```bash
openssl rand -hex 32 # NUXT_SESSION_SECRET
openssl rand -hex 32 # NUXT_DATA_ENCRYPTION_KEY
```

`NUXT_DATA_ENCRYPTION_KEY` cifra con AES-256-GCM le API key LLM e le connection URL prima che vengano scritte nel datastore. Non cambiare o perdere questa chiave: senza di essa i secret già cifrati non sono recuperabili.

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

`.env`, tutte le sue varianti e `server/data/*.json` sono esclusi da Git. `.env.example` contiene solo placeholder ed è l'unico file di configurazione versionato. I secret dei workspace sono cifrati at-rest; in produzione è comunque consigliato fornire `NUXT_DATA_ENCRYPTION_KEY` tramite il secret manager della piattaforma invece di un file.
