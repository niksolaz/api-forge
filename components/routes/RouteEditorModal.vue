<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  editing: boolean;
  modelValue: any;
  error?: string;
}>();
const emit = defineEmits<{
  close: [];
  save: [];
  "update:modelValue": [value: any];
}>();
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <form class="card modal" @submit.prevent="$emit('save')">
      <div class="modal-head">
        <h2>{{ editing ? "Modifica rotta" : "Nuova rotta" }}</h2>
        <button type="button" class="btn secondary" @click="$emit('close')">
          Chiudi
        </button>
      </div>
      <div class="grid form-grid">
        <div class="field">
          <label>Metodo</label
          ><select v-model="form.method">
            <option
              v-for="method in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
              :key="method"
            >
              {{ method }}
            </option>
          </select>
        </div>
        <div class="field">
          <label>Path</label><input v-model="form.path" required />
        </div>
        <div class="field span-2">
          <label>Titolo</label><input v-model="form.summary" required />
        </div>
        <div class="field span-2">
          <label>Descrizione</label
          ><textarea v-model="form.description" rows="3" />
        </div>
        <div class="field">
          <label>Autorizzazione</label
          ><select v-model="form.auth">
            <option value="public">Pubblica</option>
            <option value="api-key">API Key</option>
            <option value="bearer">Bearer JWT</option>
            <option value="session">Sessione</option>
          </select>
        </div>
        <div class="field">
          <label>Rate limit / minuto</label
          ><input v-model.number="form.rateLimit" type="number" min="0" />
        </div>
        <div class="field">
          <label>Request JSON Schema</label
          ><textarea v-model="form.requestSchema" rows="8" class="code" />
        </div>
        <div class="field">
          <label>Response JSON Schema</label
          ><textarea v-model="form.responseSchema" rows="8" class="code" />
        </div>
        <label class="span-2"
          ><input v-model="form.enabled" type="checkbox" /> Rotta attiva</label
        >
        <p v-if="error" class="error span-2">{{ error }}</p>
        <button class="btn span-2">Salva</button>
      </div>
    </form>
  </div>
</template>
