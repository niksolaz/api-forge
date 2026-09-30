import type { AuthUser } from "~/types";

export const useAuth = () => {
  const user = useState<AuthUser | null>("user", () => null);
  const loaded = useState("auth-loaded", () => false);

  async function refresh() {
    const data = await $fetch<{ user: AuthUser | null }>("/api/auth/me" as string);
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
