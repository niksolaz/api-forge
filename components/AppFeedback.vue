<script setup lang="ts">
defineProps<{ notice?: string; error?: string }>();
</script>
<template>
  <p v-if="notice" class="notice" role="status">{{ notice }}</p>
  <p v-if="error" class="notice error" role="alert">{{ error }}</p>
</template>
