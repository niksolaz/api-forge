<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });
const settings = useWorkspaceSettings();
const { form, notice, error, busy } = settings;
</script>
<template>
  <AppPageHeader
    eyebrow="WORKSPACE SETTINGS"
    title="Impostazioni"
    description="Modifica identità, infrastruttura e modello del workspace."
  />
  <AppFeedback :notice="notice" :error="error" />
  <form class="grid" @submit.prevent="settings.save">
    <section class="card settings-card">
      <h2>Informazioni</h2>
      <div class="grid form-grid">
        <div class="field">
          <label>Nome workspace</label
          ><input v-model="form.name" required minlength="2" />
        </div>
        <div class="field">
          <label>Descrizione</label
          ><input v-model="form.description" required minlength="10" />
        </div>
      </div>
    </section>
    <section class="card settings-card">
      <h2>Database</h2>
      <div class="grid form-grid">
        <div class="field">
          <label>Provider</label
          ><select v-model="form.database">
            <option value="sqlite">SQLite</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="supabase">Supabase</option>
            <option value="mysql">MySQL</option>
          </select>
        </div>
        <div class="field">
          <label>Nuova connection URL / Key</label
          ><input
            v-model="form.databaseUrl"
            type="password"
            autocomplete="off"
            placeholder="Lascia vuoto per non modificarla"
          /><small class="muted"
            >La credenziale esistente non viene mai mostrata.</small
          >
        </div>
      </div>
    </section>
    <section class="card settings-card">
      <h2>Modello LLM</h2>
      <div class="grid form-grid">
        <div class="field">
          <label>Provider</label
          ><select v-model="form.llmProvider">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="gemini">Google Gemini</option>
            <option value="custom">Compatibile OpenAI</option>
          </select>
        </div>
        <div class="field">
          <label>Nuova API key</label
          ><input
            v-model="form.llmApiKey"
            type="password"
            autocomplete="off"
            placeholder="Lascia vuoto per non modificarla"
          /><small class="muted"
            >La chiave esistente non viene mai mostrata.</small
          >
        </div>
      </div>
    </section>
    <div style="display: flex; justify-content: flex-end">
      <button class="btn" :disabled="busy">
        {{ busy ? "Salvataggio…" : "Salva impostazioni" }}
      </button>
    </div>
  </form>
</template>
