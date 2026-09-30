<script setup lang="ts">
defineProps<{ document: any }>();
defineEmits<{ close: [] }>();
</script>
<template>
  <div v-if="document" class="modal-backdrop" @click.self="$emit('close')">
    <div class="card modal">
      <div class="modal-head">
        <h2>OpenAPI 3.1</h2>
        <button class="btn secondary" @click="$emit('close')">Chiudi</button>
      </div>
      <pre class="code">{{ JSON.stringify(document, null, 2) }}</pre>
    </div>
  </div>
</template>
