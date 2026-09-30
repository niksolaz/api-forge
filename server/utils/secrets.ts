import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const prefix = "enc:v1";
function encryptionKey() {
  const secret = useRuntimeConfig().dataEncryptionKey;
  if ((!secret || secret === "change-me-in-production") && !import.meta.dev)
    throw createError({
      statusCode: 500,
      statusMessage: "NUXT_DATA_ENCRYPTION_KEY non configurata",
    });
  return createHash("sha256")
    .update(secret || "api-forge-local-development")
    .digest();
}
export function isEncrypted(value?: string) {
  return !!value?.startsWith(`${prefix}:`);
}
export function encryptSecret(value?: string) {
  if (!value || isEncrypted(value)) return value;
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [
    prefix,
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}
export function decryptSecret(value?: string) {
  if (!value || !isEncrypted(value)) return value;
  const [, , iv, tag, encrypted] = value.split(":");
  if (!iv || !tag || !encrypted)
    throw new Error("Formato secret cifrato non valido");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
