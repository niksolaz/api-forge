import { createHmac, timingSafeEqual } from 'node:crypto'

function sign(value: string) { return createHmac('sha256', useRuntimeConfig().sessionSecret).update(value).digest('hex') }
export function createSession(event: any, userId: string) {
  const value = `${userId}.${Date.now() + 7 * 864e5}`
  setCookie(event, 'forge_session', `${value}.${sign(value)}`, { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev, path: '/', maxAge: 604800 })
}
export function getUserId(event: any) {
  const cookie = getCookie(event, 'forge_session'); if (!cookie) return null
  const [userId, expires, signature] = cookie.split('.'); const value = `${userId}.${expires}`
  if (!userId || !expires || !signature || Number(expires) < Date.now()) return null
  const a = Buffer.from(signature); const b = Buffer.from(sign(value)); return a.length === b.length && timingSafeEqual(a, b) ? userId : null
}
export function requireUser(event: any) { const id = getUserId(event); if (!id) throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' }); return id }
