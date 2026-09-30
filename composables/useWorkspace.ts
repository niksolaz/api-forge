import type { Project } from "~/types";

export const useWorkspace = () => {
  const projects = useState<Project[]>("workspace-projects", () => []);
  const selected = useState<Project | null>("workspace-selected", () => null);
  const loading = useState("workspace-loading", () => false);
  async function load(force = false) {
    if (loading.value) return;
    if (projects.value.length && !force) return;
    loading.value = true;
    try {
      projects.value = await $fetch<Project[]>("/api/projects" as string);
      const previous = selected.value?.id;
      selected.value =
        projects.value.find((project) => project.id === previous) ||
        projects.value[0] ||
        null;
      if (!selected.value) await navigateTo("/onboarding" as any);
    } finally {
      loading.value = false;
    }
  }
  function select(id: string) {
    selected.value =
      projects.value.find((project) => project.id === id) || null;
  }
  return { projects, selected, loading, load, select };
};
