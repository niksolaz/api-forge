<script setup lang="ts">
const { user, loaded, refresh } = useAuth();
onMounted(async () => {
  if (!loaded.value) await refresh();
});
</script>
<template>
  <section class="container" style="padding: 90px 0">
    <div style="max-width: 760px">
      <span class="tag">API DESIGN STUDIO</span>
      <h1
        style="
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.065em;
          margin: 24px 0;
        "
      >
        Dal dominio a un’API pronta da usare.
      </h1>
      <p
        class="muted"
        style="font-size: 20px; line-height: 1.6; max-width: 650px"
      >
        Descrivi il contesto, scegli database e sicurezza, configura le rotte e
        genera server e documentazione OpenAPI.
      </p>
      <NuxtLink
        class="btn"
        style="display: inline-block; text-decoration: none; margin-top: 18px"
        :to="user ? '/dashboard' : '/auth/signup'"
        >{{ user ? "Apri dashboard" : "Crea il tuo progetto" }}</NuxtLink
      >
    </div>
  </section>
</template>
