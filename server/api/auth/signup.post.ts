import { z } from "zod";
import { createSession } from "../../utils/auth";
import {
  hashPassword,
  randomUUID,
  readStore,
  writeStore,
} from "../../utils/store";
const schema = z.object({ email: z.email(), password: z.string().min(8) });
export default defineEventHandler(async (event) => {
  const parsed = schema.safeParse(await readBody(event));
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message,
    });
  const store = await readStore();
  if (store.users.some((u) => u.email === parsed.data.email.toLowerCase()))
    throw createError({
      statusCode: 409,
      statusMessage: "Email già registrata",
    });
  const { salt, hash } = hashPassword(parsed.data.password);
  const user = {
    id: randomUUID(),
    email: parsed.data.email.toLowerCase(),
    salt,
    passwordHash: hash,
  };
  store.users.push(user);
  await writeStore(store);
  createSession(event, user.id);
  return { user: { id: user.id, email: user.email } };
});
