import type { DatabaseProvider } from "~/types";
export const useWorkspaceSettings = () => {
  const { selected, load } = useWorkspace();
  const notice = ref(""),
    error = ref(""),
    busy = ref(false);
  const form = reactive({
    name: "",
    description: "",
    database: "sqlite" as DatabaseProvider,
    databaseUrl: "",
    llmProvider: "openai",
    llmApiKey: "",
  });
  async function init() {
    await load();
    if (!selected.value) return;
    Object.assign(form, {
      name: selected.value.name,
      description: selected.value.description,
      database: selected.value.database,
      llmProvider: selected.value.llmProvider,
      databaseUrl: "",
      llmApiKey: "",
    });
  }
  async function save() {
    if (!selected.value) return;
    busy.value = true;
    error.value = "";
    try {
      selected.value = await $fetch<any>(`/api/projects/${selected.value.id}`, {
        method: "PUT",
        body: form,
      });
      notice.value = "Impostazioni aggiornate.";
      form.databaseUrl = "";
      form.llmApiKey = "";
    } catch (e: any) {
      error.value = e.data?.statusMessage || "Impossibile salvare";
    } finally {
      busy.value = false;
    }
  }
  watch(() => selected.value?.id, init);
  onMounted(init);
  return { form, notice, error, busy, save };
};
