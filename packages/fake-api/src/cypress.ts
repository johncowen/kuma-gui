import { createMerge, createFetchSync } from './index.ts'
import type { Middleware, Dependencies, FS, Mocker } from './index.ts'

const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Middleware = (_req, response) => response

export const mocker = <T extends object = {}>(
  dependencies: Dependencies<T>,
  fs: FS,
): Mocker => {
  return (path, opts = {}, cb = noop) => {
    const env = dependencies.env
    dependencies.env = <T extends Parameters<typeof env>[0]>(key: T, d = '') => {
      return env(key, opts[key] ?? d)
    }
    const fetch = createFetchSync({
      dependencies,
      fs,
    })
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    path = path === '*' ? '/' : path
    const baseUrl = dependencies.env('KUMA_API_URL')
    return cy.intercept(
      {
        url: new RegExp(`${baseUrl}${path.replace(reEscape, '\\$&')}`),
      },
      (req) => {
        try {
          // headers can be string | string[], not string
          const headers = Object.entries(req.headers).reduce((prev, [key, item]) => {
            if(typeof item !== 'undefined') {
              prev[key] = Array.isArray(item) ? item[0] : item
            }
            return prev
          }, {} as Record<string, string>)

          const response = fetch(req.url, {
            method: req.method,
            headers,
          })

          const type = response.headers.get('Content-Type') ?? 'application/json'
          const resp = {
            headers: Object.fromEntries(response.headers.entries()),
            body: type.endsWith('/json') ? response.json() : response.text(),
          }

          const merged = cb({
            url: new URL(req.url),
            method: req.method,
            body: req.body,
            params: {},
          }, resp, createMerge(resp))
          if (typeof merged === 'undefined') {
            req.continue()
            return
          }

          req.reply({
            contentType: type,
            statusCode: parseInt(response.headers.get('Status-Code') ?? '200'),
            delay: parseInt(dependencies.env('KUMA_LATENCY', opts['KUMA_LATENCY'] ?? '0')),
            body: merged.body,
          })
        } catch (e) {
          console.error(e)
          req.continue()
        }
      },
    )
  }
}
