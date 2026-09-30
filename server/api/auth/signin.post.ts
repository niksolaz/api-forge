import { z } from "zod";
import { createSession } from "../../utils/auth";
import { readStore, verifyPassword } from "../../utils/store";
export default defineEventHandler(async (event) => {
  const body = z
    .object({ email: z.email(), password: z.string() })
    .parse(await readBody(event));
  const store = await readStore();
  const user = store.users.find((u) => u.email === body.email.toLowerCase());
  if (!user || !verifyPassword(body.password, user.salt, user.passwordHash))
    throw createError({
      statusCode: 401,
      statusMessage: "Credenziali non valide",
    });
  createSession(event, user.id);
  return { user: { id: user.id, email: user.email } };
});
