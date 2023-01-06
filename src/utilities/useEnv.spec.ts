import { describe, expect, test } from '@jest/globals'

import container, { TOKENS } from '@/services/container'
import { useEnv } from './useEnv'

describe('useEnv', () => {
  test('it works', () => {
    container.capture?.()
    container
      .bind(TOKENS.EnvVars)
      .toConstant({
        KUMA_NAME: 'Kuma',
        KUMA_VERSION: '100.1.1',
        KUMA_API_URL: 'http://somewhere',
        KUMA_BASE_PATH: 'http://somewhere/else',
        KUMA_DOCS_URL: 'http://somewhere/docs/0.0.x/',
        KUMA_UTM_QUERY_PARAMS: 'utm=click',
        KUMA_FEEDBACK_URL: 'https://kuma.io',
        KUMA_CHAT_URL: 'https://kuma.io/chat',
        KUMA_INSTALL_URL: 'https://kuma.io/install',
      })

    const env = useEnv()
    expect(env('KUMA_VERSION')).toBe('100.1.1')
    container.restore?.()
  })
})
