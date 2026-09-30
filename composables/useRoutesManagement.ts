import type { ApiRoute } from "~/types";
export const useRoutesManagement = () => {
  const { selected, load } = useWorkspace();
  const routes = ref<ApiRoute[]>([]),
    document = ref<any>(null),
    editorOpen = ref(false),
    editingId = ref<string | null>(null),
    error = ref(""),
    notice = ref("");
  const blank = () => ({
    method: "GET",
    path: "/resources",
    summary: "",
    description: "",
    auth: "public",
    rateLimit: 60,
    requestSchema: "{}",
    responseSchema: '{"type":"object"}',
    enabled: true,
  });
  const form = ref<any>(blank());
  async function refresh() {
    await load();
    if (selected.value)
      routes.value = await $fetch<ApiRoute[]>("/api/routes" as string, {
        query: { projectId: selected.value.id },
      });
  }
  function open(route?: ApiRoute) {
    form.value = structuredClone(route || blank());
    editingId.value = route?.id || null;
    editorOpen.value = true;
    error.value = "";
  }
  async function save() {
    try {
      if (editingId.value)
        await $fetch(`/api/routes/${editingId.value}`, {
          method: "PUT",
          body: form.value,
        });
      else
        await $fetch("/api/routes", {
          method: "POST",
          body: { ...form.value, projectId: selected.value!.id },
        });
      editorOpen.value = false;
      await refresh();
    } catch (e: any) {
      error.value = e.data?.statusMessage || "Impossibile salvare";
    }
  }
  async function remove(route: ApiRoute) {
    if (!confirm(`Eliminare ${route.method} ${route.path}?`)) return;
    await $fetch(`/api/routes/${route.id}`, { method: "DELETE" });
    notice.value = "Rotta eliminata.";
    await refresh();
  }
  async function generate() {
    const result = await $fetch<{ created: number }>(
      `/api/projects/${selected.value!.id}/generate`,
      { method: "POST" },
    );
    notice.value = result.created
      ? `${result.created} rotte generate.`
      : "Le rotte base esistono già.";
    await refresh();
  }
  async function showOpenApi() {
    document.value = await $fetch(`/api/openapi/${selected.value!.id}`);
  }
  watch(() => selected.value?.id, refresh);
  onMounted(refresh);
  return {
    routes,
    document,
    editorOpen,
    editingId,
    error,
    notice,
    form,
    open,
    save,
    remove,
    generate,
    showOpenApi,
  };
};
