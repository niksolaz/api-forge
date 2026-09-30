import type { ApiRoute, AuthMode, SecurityRule } from "~/types";
export const useSecurityPolicy = () => {
  const { selected, load } = useWorkspace();
  const routes = ref<ApiRoute[]>([]),
    notice = ref(""),
    error = ref(""),
    busy = ref(false);
  const form = reactive({
    defaultAuth: "bearer" as AuthMode,
    defaultRateLimit: 60,
    cors: "",
    csp: "",
    rules: [] as SecurityRule[],
  });
  async function init() {
    await load();
    if (!selected.value) return;
    Object.assign(form, {
      defaultAuth: selected.value.defaultAuth || "bearer",
      defaultRateLimit: selected.value.defaultRateLimit || 60,
      cors: selected.value.corsOrigins.join(", "),
      csp: selected.value.csp,
      rules: structuredClone(selected.value.securityRules || []),
    });
    routes.value = await $fetch<ApiRoute[]>("/api/routes" as string, {
      query: { projectId: selected.value.id },
    });
  }
  function addRule() {
    form.rules.push({
      id: crypto.randomUUID(),
      name: "Nuovo gruppo",
      pattern: "/api/*",
      auth: "bearer",
      rateLimit: 60,
      enabled: true,
    });
  }
  function matches(path: string, pattern: string) {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/:[^/]+/g, "[^/]+");
    return new RegExp(`^${escaped}$`).test(path);
  }
  async function save() {
    if (!selected.value) return;
    busy.value = true;
    error.value = "";
    try {
      const project = await $fetch<any>(`/api/projects/${selected.value.id}`, {
        method: "PUT",
        body: {
          defaultAuth: form.defaultAuth,
          defaultRateLimit: form.defaultRateLimit,
          corsOrigins: form.cors
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          csp: form.csp,
          securityRules: form.rules,
        },
      });
      await Promise.all(
        routes.value.map((route) => {
          const rule = form.rules.find(
            (item) => item.enabled && matches(route.path, item.pattern),
          );
          const auth = rule?.auth || form.defaultAuth,
            rateLimit = rule?.rateLimit ?? form.defaultRateLimit;
          return route.auth !== auth || route.rateLimit !== rateLimit
            ? $fetch(`/api/routes/${route.id}`, {
                method: "PUT",
                body: { auth, rateLimit },
              })
            : Promise.resolve();
        }),
      );
      selected.value = project;
      notice.value = "Regole salvate e applicate alle rotte.";
    } catch (e: any) {
      error.value = e.data?.statusMessage || "Impossibile salvare le regole";
    } finally {
      busy.value = false;
    }
  }
  watch(() => selected.value?.id, init);
  onMounted(init);
  return { form, notice, error, busy, addRule, save };
};
