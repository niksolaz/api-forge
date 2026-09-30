import { getUserId } from "../../utils/auth";
import { readStore } from "../../utils/store";
export default defineEventHandler(async (event) => {
  const id = getUserId(event);
  if (!id) return { user: null };
  const store = await readStore();
  const user = store.users.find((u) => u.id === id);
  return { user: user ? { id: user.id, email: user.email } : null };
});
