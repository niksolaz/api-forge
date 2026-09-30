import { promises as fs } from "node:fs";
import { join } from "node:path";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { ApiRoute, Project } from "~/types";

interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
}
interface Store {
  users: User[];
  projects: Project[];
  routes: ApiRoute[];
}
const file = join(process.cwd(), "server/data/store.json");
const empty: Store = { users: [], projects: [], routes: [] };

export async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    await fs.mkdir(join(process.cwd(), "server/data"), { recursive: true });
    await writeStore(empty);
    return structuredClone(empty);
  }
}
export async function writeStore(data: Store) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}
export function hashPassword(password: string, salt = randomUUID()) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}
export function verifyPassword(
  password: string,
  salt: string,
  expected: string,
) {
  const actual = scryptSync(password, salt, 64);
  const target = Buffer.from(expected, "hex");
  return actual.length === target.length && timingSafeEqual(actual, target);
}
export { randomUUID };
