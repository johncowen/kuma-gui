import { TOKENS } from '@/services/production'
import { createInjections } from '@/services/utils'

export const [
  useEnv,
  useI18n,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
  useBootstrap,
] = createInjections(
  TOKENS.env,
  TOKENS.i18n,
  TOKENS.nav,
  TOKENS.api,
  TOKENS.store,
  TOKENS.router,
  TOKENS.bootstrap,
)
