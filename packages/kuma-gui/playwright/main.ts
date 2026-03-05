import { build, token } from '@kumahq/container'
import { setupSteps } from '@kumahq/gherkin-web/playwright/browser'
import env from '@kumahq/settings/env'
import type { Env } from '@/app/application'

import { services as application } from '@/app/application/debug'
import { TOKENS as FAKE_FS, services as fakeFs } from '@/app/fake-fs'
import { services as kuma, locales } from '@/app/kuma/debug'

(async () => {
  const $ = {
    mswHandlers: token('msw.handlers'),
    ...FAKE_FS,
    env: token<typeof env>('cypress.env'),
    vars: token('cypress.env.vars'),
  }
  const get = build(
    // mocks
    fakeFs($),
    kuma($),
    locales($),
    // application($),
    //
    [
      [token('cypress.env.vars'), {
        service: () => {
          // these are only fed to the mocks
          return {
            KUMA_API_URL: () => 'http://localhost:5681',
          }
        },
        labels: [
          $.vars,
        ],
      }],

      [$.env, {
        service: env,
        arguments: [
          $.vars,
        ],
      }],
      // [token('env.debug'), {
      //   service: (getEnv: () => Env) => {
      //     const env = getEnv()
      //     return (...[ key, ...rest ]: Parameters<Env>) => {
      //       // make sure you can't read/replace anything but PREFIX_*
      //       return Cookie.parse(document.cookie ?? '', { prefix: `${prefix}_`})[key] ?? env(key, ...rest)
      //     }
      //   },
      //   decorates: $.env,
      // }],
    ],
    // cypress
    // e2e($),
    //
  )
  setupSteps({
    dependencies: get($.dependencies),
    fs: get($.fakeFS),
  })
})()
