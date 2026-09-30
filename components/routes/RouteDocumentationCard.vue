<script setup lang="ts">
import type { ApiRoute } from "~/types";
defineProps<{ route: ApiRoute }>();
defineEmits<{ edit: [route: ApiRoute]; remove: [route: ApiRoute] }>();
function schema(value: string) {
  try {
    return JSON.stringify(JSON.parse(value || "{}"), null, 2);
  } catch {
    return value;
  }
}
</script>
<template>
  <article class="card api-doc">
    <header>
      <span class="method" :class="route.method">{{ route.method }}</span
      ><code>{{ route.path }}</code
      ><span class="tag">{{ route.auth }}</span
      ><span class="tag">{{ route.rateLimit }}/min</span>
    </header>
    <h2>{{ route.summary }}</h2>
    <p class="muted">{{ route.description || "Nessuna descrizione." }}</p>
    <details>
      <summary>Schemi JSON</summary>
      <div class="schema-grid">
        <div>
          <b>Request</b>
          <pre class="code">{{ schema(route.requestSchema) }}</pre>
        </div>
        <div>
          <b>Response</b>
          <pre class="code">{{ schema(route.responseSchema) }}</pre>
        </div>
      </div>
    </details>
    <footer class="actions">
      <button class="btn secondary" @click="$emit('edit', route)">
        Modifica</button
      ><button class="btn danger" @click="$emit('remove', route)">
        Elimina rotta
      </button>
    </footer>
  </article>
</template>
