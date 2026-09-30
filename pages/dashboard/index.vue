<script setup lang="ts">
import type { ApiRoute } from "~/types";
definePageMeta({ middleware: "auth", layout: "dashboard" });
const { selected, load } = useWorkspace();
const routes = ref<ApiRoute[]>([]);
async function refresh() {
  await load();
  if (selected.value)
    routes.value = await $fetch<ApiRoute[]>("/api/routes" as string, {
      query: { projectId: selected.value.id },
    });
}
watch(() => selected.value?.id, refresh);
onMounted(refresh);
</script>
<template>
  <div v-if="selected" class="grid">
    <div class="topbar">
      <div>
        <span class="tag">PANORAMICA</span>
        <h1 class="page-title" style="margin-top: 12px">{{ selected.name }}</h1>
        <p class="muted">{{ selected.description }}</p>
      </div>
      <NuxtLink class="btn" to="/dashboard/routes">Gestisci API</NuxtLink>
    </div>
    <div class="grid stat-grid">
      <div class="card stat">
        <span class="muted">Rotte</span><strong>{{ routes.length }}</strong>
      </div>
      <div class="card stat">
        <span class="muted">Protette</span
        ><strong>{{ routes.filter((r) => r.auth !== "public").length }}</strong>
      </div>
      <div class="card stat">
        <span class="muted">Database</span
        ><strong style="font-size: 20px; text-transform: capitalize">{{
          selected.database
        }}</strong>
      </div>
    </div>
    <section class="card settings-card">
      <h2>Contesto di dominio</h2>
      <p class="muted preline">{{ selected.context }}</p>
      <div class="actions wrap">
        <span class="tag">CORS · {{ selected.corsOrigins.join(", ") }}</span
        ><span class="tag">CSP attiva</span
        ><span class="tag">LLM · {{ selected.llmProvider }}</span>
      </div>
    </section>
    <div class="grid quick-grid">
      <NuxtLink class="card quick-link" to="/dashboard/routes"
        ><strong>Documentazione rotte</strong
        ><span>Consulta schemi, auth, limiti e OpenAPI →</span></NuxtLink
      ><NuxtLink class="card quick-link" to="/dashboard/security"
        ><strong>Regole di sicurezza</strong
        ><span>Configura policy globali e gruppi →</span></NuxtLink
      ><NuxtLink class="card quick-link" to="/dashboard/settings"
        ><strong>Settings</strong
        ><span>Database, LLM e informazioni workspace →</span></NuxtLink
      >
    </div>
  </div>
</template>
