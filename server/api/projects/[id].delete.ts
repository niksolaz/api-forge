import { requireUser } from '../../utils/auth'
import { readStore, writeStore } from '../../utils/store'

export default defineEventHandler(async event => {
  const userId = requireUser(event)
  const id = getRouterParam(event, 'id')
  const store = await readStore()
  const project = store.projects.find((item: any) => item.id === id && item.userId === userId)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Workspace non trovato' })
  store.projects = store.projects.filter(item => item.id !== id)
  store.routes = store.routes.filter(route => route.projectId !== id)
  await writeStore(store)
  return { ok: true }
})
