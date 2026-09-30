<script setup lang="ts">
const { projects, selected, load, select } = useWorkspace();
onMounted(() => load());
async function removeWorkspace() {
  if (!selected.value) return;
  const name = selected.value.name;
  if (!confirm(`Eliminare definitivamente “${name}” e tutte le sue rotte?`))
    return;
  await $fetch(`/api/projects/${selected.value.id}`, { method: "DELETE" });
  await load(true);
}
</script>
<template>
  <header class="container nav">
    <NuxtLink to="/" class="brand" style="text-decoration: none; color: inherit"
      >API <span>Forge</span></NuxtLink
    >
    <div class="actions">
      <select
        v-if="projects.length"
        :value="selected?.id"
        class="workspace-select"
        @change="select(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="project in projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option></select
      ><NuxtLink class="btn secondary" to="/onboarding"
        >Nuovo workspace</NuxtLink
      >
    </div>
  </header>
  <main class="container dashboard-shell">
    <aside class="card sidebar">
      <NuxtLink to="/dashboard" exact-active-class="router-link-active"
        >Panoramica</NuxtLink
      ><NuxtLink to="/dashboard/routes">Documentazione rotte</NuxtLink
      ><NuxtLink to="/dashboard/security">Sicurezza</NuxtLink
      ><NuxtLink to="/dashboard/settings">Settings</NuxtLink
      ><button class="sidebar-danger" @click="removeWorkspace">
        Elimina workspace
      </button>
    </aside>
    <section class="dashboard-content"><slot /></section>
  </main>
</template>
