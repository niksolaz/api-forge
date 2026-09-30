export default defineEventHandler((event) => {
  deleteCookie(event, "forge_session", { path: "/" });
  return { ok: true };
});
