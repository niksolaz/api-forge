export const useAuth = () => {
  const user = useState<unknown | null>("user", () => null);
  const loaded = useState("auth-loaded", () => false);

  async function refresh() {
    const data = await $fetch("/api/auth/me");
    user.value = data.user;
    loaded.value = true;
  }

  async function signout() {
    await $fetch("/api/auth/signout", { method: "POST" });
    user.value = null;
    await navigateTo("/auth/signin");
  }
  return { user, loaded, refresh, signout };
};
