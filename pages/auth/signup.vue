<script setup lang="ts">
const auth = useAuthForm("signup");
</script>
<template>
  <section class="container auth-shell">
    <AuthForm
      mode="signup"
      :busy="auth.busy.value"
      :error="auth.error.value"
      @submit="auth.submit"
    />
  </section>
</template>
