import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('configuration.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
    [token('configuration.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}