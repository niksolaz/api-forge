<script setup lang="ts">
import RouteDocumentationCard from "~/components/routes/RouteDocumentationCard.vue";
import RouteEditorModal from "~/components/routes/RouteEditorModal.vue";

definePageMeta({ middleware: "auth", layout: "dashboard" });
const routesManager = useRoutesManagement();
const { routes, document, editorOpen, editingId, error, notice, form } =
  routesManager;
</script>
<template>
  <AppPageHeader
    eyebrow="DOCUMENTAZIONE"
    title="Rotte API"
    description="Contratto, sicurezza e schemi di ogni endpoint."
    ><template #actions
      ><button class="btn secondary" @click="routesManager.generate">
        Genera CRUD</button
      ><button class="btn secondary" @click="routesManager.showOpenApi">
        OpenAPI JSON</button
      ><button class="btn" @click="routesManager.open()">
        Nuova rotta
      </button></template
    ></AppPageHeader
  ><AppFeedback :notice="notice" />
  <div class="grid">
    <RouteDocumentationCard
      v-for="route in routes"
      :key="route.id"
      :route="route"
      @edit="routesManager.open"
      @remove="routesManager.remove"
    />
    <div v-if="!routes.length" class="card empty">
      <h2>Nessuna rotta</h2>
      <button class="btn" @click="routesManager.generate">
        Genera rotte base
      </button>
    </div>
  </div>
  <RouteEditorModal
    v-model="form"
    :open="editorOpen"
    :editing="!!editingId"
    :error="error"
    @close="editorOpen = false"
    @save="routesManager.save"
  /><OpenApiModal :document="document" @close="document = null" />
</template>
