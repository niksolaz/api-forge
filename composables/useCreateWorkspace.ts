export const useCreateWorkspace = () => {
  const form = reactive({
    name: "",
    description: "",
    context: "",
    domain: "",
    llmProvider: "openai",
    llmApiKey: "",
    database: "sqlite",
    databaseUrl: "",
    cors: "http://localhost:3000",
    csp: "default-src 'self'; frame-ancestors 'none'",
  });
  const error = ref(""),
    busy = ref(false);
  async function submit() {
    busy.value = true;
    error.value = "";
    try {
      await $fetch("/api/projects", {
        method: "POST",
        body: {
          ...form,
          corsOrigins: form.cors
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        },
      });
      const workspace = useWorkspace();
      workspace.projects.value = [];
      workspace.selected.value = null;
      await navigateTo("/dashboard");
    } catch (e: any) {
      error.value = e.data?.statusMessage || "Controlla i dati inseriti";
    } finally {
      busy.value = false;
    }
  }
  return { form, error, busy, submit };
};
