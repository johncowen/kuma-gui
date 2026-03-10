import { createFetch, routeToRegexp } from '@kumahq/fake-api'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import { getClient, YAML, merge } from '../..'
import { config } from '../config'
import type { DataTable } from '@cucumber/cucumber'

type Middleware = (req: { url: URL, method: string, body: any }, res: any) => typeof res
type BaseMock = (route: string, opts?: Record<string, string>, cb?: Middleware) => ReturnType<typeof cy['intercept']>

type BaseClient = ReturnType<typeof getClient>

type Options<TMock extends BaseMock> = {
  dependencies: any
  fs: any
  mock?: TMock
  client?: BaseClient
}
export async function setupSteps<TMock extends BaseMock>({ dependencies, fs, mock, client = getClient() }: Options<TMock>) {
  const { Given, When, Then, Before, After } = createBdd()
  const negativeTimeout = parseInt(config.KUMA_NEGATIVE_TIMEOUT) || 4000
  const timeout = (negative: boolean) => negative ? { timeout: negativeTimeout } : {}

  const $ = (...args: string[]) => {
    return resolveCustomAlias(...args).join(' ')
  }

  function resolveCustomAlias(...args: string[]): string[] {
    let selector = args[0]
    if (selector.startsWith('$')) {
      const alias = selector.split(/[: .[#]/).shift()!.substring(1)
      if (typeof selectors[alias] === 'undefined') {
        throw new Error(`Could not find alias $${alias}. Make sure you have defined the alias in a CSS selectors step`)
      }
      selector = selector.replace(`$${alias}`, selectors[alias])
      return resolveCustomAlias(selector, args[1])
    }
    return args
  }

  let env: Record<string, string> = {}
  let selectors: Record<string, string> = {}
  let localStorage: Set<string>
  // const router = new Router(fs)
  // const createFetch = (_context: BrowserContext) => async (url: string, options: RequestInit) => {
  //   const _url = new URL(url)
  //   const { route, params } = router.match(_url.pathname)
  //
  //   const _env = <T extends Parameters<typeof dependencies['env']>[0]>(key: T, d = '') => dependencies.env(key, (env[key] ?? d).toString())
  //   const request = route({
  //     ...dependencies,
  //     env: _env,
  //   })
  //   const response = request({
  //     url: _url,
  //     method: options.method ?? 'GET',
  //     body: {}, // options.body ?? {},
  //     params,
  //   })
  //   if (typeof response === 'undefined') {
  //     throw new Error('not found')
  //   }
  //   client.request({
  //     url: _url,
  //     request: {
  //       method: options.method ?? 'GET',
  //       body: {}, // request.postData(),
  //     },
  //   })
  //   await new Promise(resolve => setTimeout(resolve, parseInt(_env('KUMA_LATENCY', '0'))))
  //   return {
  //     json: async () => {
  //       return response.body
  //     },
  //     text: async () => {
  //       return response.body.toString()
  //     },
  //     headers: new Map(Object.entries(response.headers ?? {})),
  //   }
  // }
  const fetch = createFetch({
    dependencies,
    fs,
  })
  Before(async ({ context }) => {

    client.reset()
    env = {}
    selectors = {}
    localStorage = new Set()
    await context.unrouteAll()
    await context.addCookies([
      {
        name: 'KUMA_MOCK_API_ENABLED',
        value: 'false',
        url: `${config.KUMA_BASE_URL}`,
      },
    ])
    const p = Object.keys(fs).map(route => {
      return context.route(
        (u) => {
          // if(u.pathname.includes('mesh/control-planes')) {
          //   console.log(u.toString(), routeToRegexp(route))
          // }
          return routeToRegexp(route).test(u.toString())
        },
        async (route, request) => {
          const url = request.url()
          // console.log(url)
          try {
            const cookies = await context.cookies()
            const response = await fetch(url, {
              method: request.method(),
              headers: {
                cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
                ...request.headers()
              },
            })
            if (env.KUMA_LATENCY) {
              await new Promise((resolve) => setTimeout(resolve, parseInt(env.KUMA_LATENCY)))
            }
            // console.log(url, request.postDataJSON())
            client.request({
              url: new URL(url),
              request: {
                method: request.method(),
                // TODO: this could be wrong
                body: request.postDataJSON() ?? {},
              },
            })
            const type = response.headers.get('Content-Type') ?? 'application/json'
            const body = type.endsWith('/json') ? JSON.stringify((await response.json()), null, 4) : (await response.text())
            await route.fulfill({
              status: parseInt(response.headers.get('Status-Code') ?? '200'),
              contentType: type,
              body,
            })
          } catch (e) {
            console.error(e)
            await route.continue()
          }
        })

    })
    await Promise.all(p)

  })
  After(async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    // Array.from(localStorage).forEach((key) => {
    //   window.localStorage.removeItem(key)
    // })
  })

  // arrange
  Given('the CSS selectors', ({ page: _page }, table: DataTable) => {
    table.hashes().forEach(
      (item) => {
        selectors[item.Alias] = item.Selector
      },
    )
  })
  Given('the environment', async ({ context }, yaml: string) => {
    env = {
      ...env,
      ...YAML.parse(yaml) as object,
    }
    await context.addCookies(Object.entries(env).map(([key, value]) => ({
      name: key,
      value: String(value),
      url: `${config.KUMA_BASE_URL}`,
    })))
  })

  Given('the localStorage', async ({ page, context }, yaml: string) => {
    const obj = YAML.parse(yaml) as object
    await context.addInitScript((data: any) => {
      Object.entries(data).forEach(([key, value]) => {
        window.localStorage.setItem(key, JSON.stringify(value))
      })
    }, obj)
    Object.entries(obj).forEach(([key, value]) => {
      localStorage.add(key)
    })
  })

  Given('the URL {string} responds with', async ({ context }, route: string, yaml: string) => {
    await context.route(
      (u) => routeToRegexp(route).test(new URL(u).pathname),
      async (route, request) => {
        try {
          const url = request.url()
          const cookies = await context.cookies()
          const response = await fetch(url, {
            method: request.method(),
            headers: {
              cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
              ...request.headers()
            },
          })
            // console.log(url, request.postDataJSON())
          client.request({
            url: new URL(url),
            request: {
              method: request.method(),
              // TODO: this could be wrong
              body: request.postDataJSON() ?? {},
            },
          })
          const type = response.headers.get('Content-Type') ?? 'application/json'
          let merged
          const _yaml = (YAML.parse(yaml) ?? {}) as {
            headers?: Record<string, string>
            body?: Record<string, unknown>
          }
          if (type.endsWith('/json')) {
            // TODO: properly merge the headers
            merged = merge({ body: await response.json(), headers: {} }, _yaml) as any
            await route.fulfill({
              contentType: type,
              status: parseInt(merged.headers?.['Status-Code'] ?? response.headers.get('Status-Code') ?? '200'),
              body: JSON.stringify(merged.body),
            })
          } else {
            merged = _yaml
            await route.fulfill({
              contentType: type,
              status: parseInt(merged.headers?.['Status-Code'] ?? response.headers.get('Status-Code') ?? '200'),
              body: merged.body,
            })
          }
          return
        } catch (e) {
          console.error(e)
        }
        await route.continue()
      })
  })

  Given('the date is {string}', async ({ page }, datetime: string) => {
    await page.clock.install({ time: new Date(datetime) })
    // cy.clock(new Date(datetime).getTime(), ['Date'])
  })

  // act

  When('I visit the {string} URL', async ({ page }, path: string) => {
    const url = `${config.KUMA_BASE_URL}${path}`
    await page.goto(url)
    await page.locator('[data-testid-root="mesh-app"]').waitFor({
      state: 'attached'
    })
  })

  // When('I load the {string} URL', async ({ page }, path: string) => {
  //   const url = `${config.KUMA_BASE_URL}${path}`
  //   await page.goto(url)
  // })

  // TODO(jc): we can probably combine these 2 steps
  When(/^I click the "(.*)" element(?: and select "(.*)")?$/, async ({ page }, selector: string, _value?: string) => {
    const $elem = page.locator($(selector))
    switch ('click') {
      case 'click':
        await $elem.dispatchEvent('click')
        // await $elem.click({ force: true })
        break
    }
    // if (value !== undefined) {
    //   $(selector).select(value)
    // } else {
    //   $(selector)[event]({ force: true })
    // }
  })

  When(/^I (.*) on the "(.*)" element$/, async ({ page }, event: string, selector: string) => {
    const $elem = page.locator($(selector))
    switch (event) {
      case 'hover':
        await $elem.hover({ force: true })
        break
      case 'click':
        await $elem.dispatchEvent('click')
        // await $elem.click({ force: true })
        break
    }
  })
  //

  When('I {string} {string} into the {string} element', async ({ page }, event: string, text: string, selector: string) => {
    // console.log('================')
    // console.log(selector)
    const $elem = page.locator($(selector))
    switch (event) {
      case 'input':
      case 'type':
        // TODO: make a "I press/hit enter" or similar step
        if (text === '{enter}') {
          await $elem.press('Enter')
        } else {
          await $elem.pressSequentially(text, { delay: 50 })
        }
        break
    }
  })

  When('I clear the {string} element', async ({ page }, selector: string) => {
    await page.locator($(selector)).clear()
  })

  When('I navigate {string}', async ({ page }, direction: 'back' | 'forward' | 'forwards') => {
    switch (direction) {
      case 'back':
        await page.goBack()
        break
      default:
        await page.goForward()
        break
    }
  })

  // assert

  Then('the URL is {string}', async ({ page }, expected: string) => {
    const base = config.KUMA_BASE_URL
    await page.waitForURL(`${base}${expected}`)
  })

  Then(/^the URL( doesn't | )contain[s]? "(.*)"$/, async ({ page }, assertion: string, str: string) => {
    const negative = assertion !== ' '
    await page.waitForURL((url) => {
      const path = `${url.pathname}${url.search}`
      return !negative ? path.includes(str) : !path.includes(str)
    })
  })

  // whilst the response is sent after waitForRequest resolves the response itself
  // has been rendered on the server therefore any mocking done after this step
  // will apply to the following request
  Then(/^the URL "(.*)" was?(n't | not | )requested with$/, async ({ page: _page }, url: string, not: string = '', yaml: string) => {
    const found = await client.waitForRequest({
      url,
      ...YAML.parse(yaml) as {
        method: string
        searchParams: Record<string, string>
        body: Record<string, unknown>
      },
    })
    if (not.trim().length === 0) {
      expect(found).toEqual(true)
    } else {
      expect(found).toEqual(false)
    }
  })

  Then(/^the "(.*)" element[s]? exist[s]? ([0-9]*) time[s]?$/, async ({ page }, selector: string, count: string) => {
    const $items = page.locator($(selector))
    await expect($items).toHaveCount(parseInt(count))
  })

  Then(/^the "(.*)" element[s]? exist[s]?$/, async ({ page }, selector: string) => {
    await expect(page.locator($(selector))).toBeAttached()
  })

  Then(/^the "(.*)" element[s]? exist[s]? but the "(.*)" (elements don't exist|element doesn't exist)$/, async ({ page }, exists: string, notexists: string, assertion: string) => {
    const options = {
      timeout: negativeTimeout,
    }
    const $exists = page.locator($(exists))
    const $notexists = page.locator($(notexists))
    await expect($exists).toBeAttached()
    await expect($notexists).toHaveCount(0, options)
  })

  Then(/^the "(.*)" element[s]?( isn't | aren't | is | are )(checked|disabled)$/, async ({ page }, selector: string, assertion: string, booleanAttribute: string) => {
    const negative = !['is', 'are'].includes(assertion.trim())
    const options = {
      ...timeout(negative),
    }
    const $el = page.locator($(selector))
    let ex = expect($el)
    if (negative) {
      ex = ex.not
    }
    switch (booleanAttribute) {
      case 'checked':
        await ex.toBeChecked(options)
        break
      case 'disabled':
        await ex.toBeDisabled(options)
        break
    }
  })

  Then(/^the "(.*)" element(s)? contain[s]?$/, async ({ page }, selector: string, multiple = '', table: DataTable) => {
    const rows = table.rows()
    if (multiple === 's') {
      let i = 0
      for (const $el of await page.locator($(selector)).all()) {
        const item = rows[i]
        if (item) {
          await expect($el).toContainText(rows[i])
        }
        i++
      }
    } else {
      const $el = page.locator($(selector))
      await Promise.all(rows.map((item) => expect($el).toContainText(item)))
    }
  })

  Then(/^the "(.*)" element( doesn't | )contain[s]? "(.*)"$/, async ({ page }, selector: string, assertion: string, value: string) => {
    const negative = assertion !== ' '
    const $elem = page.locator($(selector))
    const type = await $elem.evaluate(node => node.tagName)
    let ex = expect($elem)
    if (negative) {
      ex = ex.not
    }
    if (type.toLowerCase() === 'input') {
      // TODO(jc) does this need to use a RegExp for contains?
      // Cypress version never used to ?
      await ex.toHaveValue(value)
    } else {
      await ex.toContainText(value)
    }
  })

  Then(/^the "(.*)" element is empty$/, async ({ page }, selector: string) => {
    await expect(page.locator($(selector))).toBeEmpty()
  })

  Then('the page title contains {string}', async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title))
  })

  // debug
  When('I wait for {int} milliseconds/ms', async ({ page }, ms: number) => {
    await page.waitForTimeout(ms)
  })
  Then('pause', async ({ page }) => {
    await page.pause()
  })
  Then(/^(everything is )?ok$/, async () => {
    expect(true).toBe(true)
  })
  Then('log {string}', async ({ page: _page }, message: string) => {
    console.log(message)
  })
}
