import { requireUser } from '../../utils/auth'
import { readStore } from '../../utils/store'
export default defineEventHandler(async event => { const userId = requireUser(event); const store = await readStore(); return store.projects.filter((p: any) => p.userId === userId).map(({ llmApiKey, databaseUrl, ...p }: any) => ({ ...p, hasLlmKey: !!llmApiKey, hasDatabaseUrl: !!databaseUrl })) })
