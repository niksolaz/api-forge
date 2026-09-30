<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description: string }>();
</script>
<template>
  <div class="topbar">
    <div>
      <span class="tag">{{ eyebrow }}</span>
      <h1 class="page-title" style="margin-top: 12px">{{ title }}</h1>
      <p class="muted">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
  </div>
</template>
