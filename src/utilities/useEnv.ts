import container, { TOKENS } from '@/services/container'
import { EnvVars } from '@/services/env'

export const useEnv = () => {
  return (key: keyof EnvVars) => {
    return container.get(TOKENS.Env).var(key)
  }
}
