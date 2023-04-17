
import { setupServer } from 'msw/node'

import { Alias, ServiceDefinition, token } from './utils'
import Env from '@/services/env/Env'
import { mocker, fakeApi, FS } from '@/test-support'
import type { Mocker } from '@/test-support'

export const TOKENS = {
  mock: token<Mocker>('mocker'),
}
const $ = TOKENS

type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [app.msw, {
    service: (env: Alias<Env['var']>, fs: FS) => {
      const mock = fakeApi(env, fs)
      return setupServer(...mock('*'))
    },
    arguments: [
      app.env,
      app.fakeFS,
    ],
  }],
  [$.mock, {
    service: mocker,
    arguments: [
      app.env,
      app.msw,
      app.fakeFS,
    ],
  }],
]
