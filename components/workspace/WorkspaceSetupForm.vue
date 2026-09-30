<script setup lang="ts">
const props = defineProps<{
  modelValue: any;
  busy?: boolean;
  error?: string;
}>();
defineEmits<{ submit: [] }>();
const form = computed(() => props.modelValue);
const domainExamples = [
  "E-commerce B2B",
  "Prenotazioni",
  "Gestione progetti",
  "Formazione online",
];
function chooseDomain(value: string) {
  form.value.domain = value;
}
function addContextTemplate() {
  if (
    form.value.context &&
    !confirm("Sostituire il testo già inserito con una traccia guidata?")
  )
    return;
  form.value.context = `Utenti e ruoli:\n- Chi usa il servizio? Cosa può fare ogni ruolo?\n\nDati principali:\n- Quali elementi gestisce il sistema e come sono collegati?\n\nFlusso principale:\n1. Cosa avvia il processo?\n2. Quali passaggi deve completare l’utente?\n3. Quando il processo è concluso?\n\nRegole e vincoli:\n- Cosa è obbligatorio?\n- Cosa non deve mai accadere?\n- Quali stati o approvazioni sono previsti?`;
}
</script>
<template>
  <form
    class="card grid form-grid"
    style="padding: 28px"
    @submit.prevent="$emit('submit')"
  >
    <div class="form-section span-2">
      <span class="step-number">1</span>
      <div>
        <h2>Descrivi cosa vuoi costruire</h2>
        <p>
          Non servono termini tecnici. Pensa al prodotto e alle persone che lo
          useranno.
        </p>
      </div>
    </div>
    <div class="field">
      <label for="workspace-name">Come vuoi chiamare il progetto?</label>
      <input
        id="workspace-name"
        v-model="form.name"
        required
        placeholder="Es. Commerce API"
      />
      <small class="field-help"
        >È il nome che vedrai nella dashboard e nella documentazione.</small
      >
    </div>
    <div class="field">
      <label for="workspace-domain">In quale ambito lavorerà l’API?</label>
      <input
        id="workspace-domain"
        v-model="form.domain"
        required
        list="domain-suggestions"
        placeholder="Es. E-commerce B2B"
      />
      <datalist id="domain-suggestions">
        <option
          v-for="example in domainExamples"
          :key="example"
          :value="example"
        />
      </datalist>
      <small class="field-help"
        >Il dominio aiuta a dare nomi sensati alle prime risorse e rotte.</small
      >
      <div class="suggestion-list">
        <button
          v-for="example in domainExamples"
          :key="example"
          type="button"
          class="suggestion"
          @click="chooseDomain(example)"
        >
          {{ example }}
        </button>
      </div>
    </div>
    <div class="field span-2">
      <div class="label-row">
        <label for="workspace-description"
          >In una frase, cosa permette di fare?</label
        ><small>{{ form.description.length }}/180</small>
      </div>
      <textarea
        id="workspace-description"
        v-model="form.description"
        required
        minlength="10"
        maxlength="180"
        rows="2"
        placeholder="Es. Permette ai rivenditori di consultare il catalogo, creare ordini e seguirne la consegna."
      />
      <small class="field-help"
        >Scrivila come la spiegheresti a un collega, senza elencare
        tecnologie.</small
      >
    </div>
    <div class="field span-2">
      <div class="label-row">
        <label for="workspace-context">Come funziona questo mondo?</label
        ><button type="button" class="text-button" @click="addContextTemplate">
          Usa una traccia guidata
        </button>
      </div>
      <p class="field-intro">
        Racconta chi usa il servizio, quali dati gestisce, il flusso più
        importante e le regole che non possono essere violate.
      </p>
      <textarea
        id="workspace-context"
        v-model="form.context"
        required
        minlength="10"
        rows="10"
        placeholder="Es. Un cliente può avere più ordini. Ogni ordine contiene uno o più prodotti e parte in stato bozza. Solo il proprietario può modificarlo. Un ordine confermato non può essere eliminato…"
      />
      <div class="prompt-grid">
        <span>👤 Chi sono gli utenti?</span><span>📦 Quali dati gestisci?</span
        ><span>➡️ Qual è il flusso principale?</span
        ><span>🛡️ Quali regole sono obbligatorie?</span>
      </div>
    </div>
    <div class="form-section span-2">
      <span class="step-number">2</span>
      <div>
        <h2>Collega i servizi</h2>
        <p>
          Scegli modello e database. Potrai cambiarli in seguito dalle
          impostazioni.
        </p>
      </div>
    </div>
    <div class="field">
      <label>Provider LLM</label
      ><select v-model="form.llmProvider">
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="gemini">Google Gemini</option>
        <option value="custom">Compatibile OpenAI</option>
      </select>
    </div>
    <div class="field">
      <label>API key LLM</label
      ><input
        v-model="form.llmApiKey"
        type="password"
        required
        autocomplete="off"
      />
    </div>
    <div class="field">
      <label>Database</label
      ><select v-model="form.database">
        <option value="sqlite">SQLite</option>
        <option value="postgresql">PostgreSQL</option>
        <option value="supabase">Supabase</option>
        <option value="mysql">MySQL</option>
      </select>
    </div>
    <div class="field">
      <label>{{
        form.database === "sqlite"
          ? "Percorso opzionale"
          : "Connection URL / Key"
      }}</label
      ><input
        v-model="form.databaseUrl"
        type="password"
        :required="form.database !== 'sqlite'"
        autocomplete="off"
      />
    </div>
    <details class="advanced-settings span-2">
      <summary>Impostazioni avanzate di sicurezza</summary>
      <div class="grid" style="margin-top: 16px">
        <div class="field">
          <label>Origini CORS (separate da virgola)</label
          ><input v-model="form.cors" />
        </div>
        <div class="field">
          <label>Content Security Policy</label><input v-model="form.csp" />
        </div>
      </div>
    </details>
    <p v-if="error" class="error span-2">{{ error }}</p>
    <div class="span-2" style="display: flex; justify-content: flex-end">
      <button class="btn" :disabled="busy">
        {{ busy ? "Creazione…" : "Crea progetto" }}
      </button>
    </div>
  </form>
</template>
