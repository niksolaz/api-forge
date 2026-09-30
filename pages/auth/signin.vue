<script setup lang="ts">
const auth = useAuthForm("signin");
</script>
<template>
  <section class="container auth-shell">
    <AuthForm
      mode="signin"
      :busy="auth.busy.value"
      :error="auth.error.value"
      @submit="auth.submit"
    />
  </section>
</template>
