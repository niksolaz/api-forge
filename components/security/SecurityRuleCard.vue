<script setup lang="ts">
import type { SecurityRule } from "~/types";
defineProps<{ modelValue: SecurityRule }>();
defineEmits<{ remove: [] }>();
</script>
<template>
  <article class="card rule-row">
    <input
      v-model="modelValue.enabled"
      type="checkbox"
      :aria-label="`Abilita ${modelValue.name}`"
    />
    <div class="field">
      <label>Nome</label><input v-model="modelValue.name" />
    </div>
    <div class="field">
      <label>Pattern</label
      ><input v-model="modelValue.pattern" placeholder="/admin/*" />
    </div>
    <div class="field">
      <label>Auth</label
      ><select v-model="modelValue.auth">
        <option value="public">Pubblica</option>
        <option value="api-key">API Key</option>
        <option value="bearer">Bearer JWT</option>
        <option value="session">Sessione</option>
      </select>
    </div>
    <div class="field">
      <label>Req/min</label
      ><input v-model.number="modelValue.rateLimit" type="number" min="0" />
    </div>
    <button class="btn danger" @click="$emit('remove')">Rimuovi</button>
  </article>
</template>
