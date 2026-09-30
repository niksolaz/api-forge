<script setup lang="ts">
const { user, signout } = useAuth();
</script>
<template>
  <header class="container nav">
    <NuxtLink to="/" class="brand" style="text-decoration: none; color: inherit"
      >API <span>Forge</span></NuxtLink
    >
    <nav class="actions">
      <template v-if="user"
        ><span class="muted" style="align-self: center">{{ user.email }}</span
        ><button class="btn secondary" @click="signout">Esci</button></template
      ><template v-else
        ><NuxtLink class="btn secondary" to="/auth/signin">Accedi</NuxtLink
        ><NuxtLink class="btn" to="/auth/signup">Inizia</NuxtLink></template
      >
    </nav>
  </header>
  <main><slot /></main>
</template>
