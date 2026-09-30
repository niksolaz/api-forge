<script setup lang="ts">
import WorkspaceSetupForm from "~/components/workspace/WorkspaceSetupForm.vue";

definePageMeta({ middleware: "auth" });
const workspace = useCreateWorkspace();
</script>
<template>
  <section class="container" style="padding: 42px 0 80px; max-width: 850px">
    <AppPageHeader
      eyebrow="CONFIGURAZIONE"
      title="Raccontaci la tua API"
      description="Il contesto guiderà la struttura del progetto e la documentazione."
    />
    <WorkspaceSetupForm
      :model-value="workspace.form"
      :busy="workspace.busy.value"
      :error="workspace.error.value"
      @submit="workspace.submit"
    />
  </section>
</template>
