export const useAuthForm = (mode: "signin" | "signup") => {
  const error = ref("");
  const busy = ref(false);

  async function submit(form: { email: string; password: string }) {
    busy.value = true;
    error.value = "";
    try {
      await $fetch(`/api/auth/${mode}`, { method: "POST", body: form });
      await useAuth().refresh();
      await navigateTo(mode === "signup" ? "/onboarding" : "/dashboard");
    } catch (e: any) {
      error.value =
        e.data?.statusMessage ||
        (mode === "signup"
          ? "Registrazione non riuscita"
          : "Accesso non riuscito");
    } finally {
      busy.value = false;
    }
  }
  return { error, busy, submit };
};
