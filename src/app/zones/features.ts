import type { Features } from '@/app/application/services/can'
import type Env from '@/services/env/Env'
export const features = (env: Env['var']): Features => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
  }
}
