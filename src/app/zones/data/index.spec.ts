import { describe, expect, test } from 'vitest'

import { ZoneOverview } from './'
import { useResponder } from '@/test-support'
import mock from '@/test-support/mocks/src/zones/_/_overview'
import { ZoneOverview as PartialZoneOverview } from '@/types/index'

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

type Assert = (actual: ZoneOverview, item: PartialZoneOverview) => void
type Context = {
  message: string
  assert: Assert
  get: () => Promise<PartialZoneOverview>
}
type Test = {
  env?: Record<string, string>
  message: string
  assert: Assert
  setup: (item: PartialZoneOverview) => Promise<PartialZoneOverview>
}

const freeze = (obj: any) => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
      freeze(obj[prop])
    }
  })
  return Object.freeze(obj)
}

const get = async (env: Record<string, string>) => {
  const responder = useResponder({
    _: mock,
  }, (key: string, d = '') => env[key] ?? d)
  const request = responder('_')
  return (await request(
    {
      method: 'GET',
      body: {},
      url: {
        searchParams: new URLSearchParams(),
      },
      params: {
        name: 'zone',
      },
    },
  )).body
}

const map = (test: Test) => {
  return {
    message: test.message,
    assert: test.assert,
    get: async () => {
      const item = (await get(test.env ?? {})) as unknown as Writeable<PartialZoneOverview>
      return freeze(await test.setup(item)) as Readonly<PartialZoneOverview>
    },
  }
}
const run = async ({ get, assert }: Context) => {
  const item = await get()
  assert(ZoneOverview.fromObject(item), item)
}
//
describe('ZoneOverview', () => {
  describe('zone.enabled', () => {
    test.each(([
      {
        message: 'absent means enabled=true',
        setup: async (item) => {
          delete item.zone.enabled
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(true)
        },
      },
      {
        message: 'true means enabled=true',
        setup: async (item) => {
          item.zone.enabled = true
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(true)
        },
      },
      {
        message: 'false means enabled=false',
        setup: async (item) => {
          item.zone.enabled = false
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(false)
        },
      },
      {
        message: 'null means enabled=true',
        setup: async (item) => {
          // @ts-ignore
          item.zone.enabled = null
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(true)
        },
      },
      {
        message: '"" means enabled=true',
        setup: async (item) => {
          // @ts-ignore
          item.zone.enabled = ''
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(true)
        },
      },
      {
        message: '0 means enabled=true',
        setup: async (item) => {
          // @ts-ignore
          item.zone.enabled = 0
          return item
        },
        assert: (actual) => {
          expect(actual.zone.enabled).toStrictEqual(true)
        },
      },
    ] as Test[]).map(map))('$message', run)
  })
  describe('zoneInsight.subscriptions', () => {
    test.each(([
      {
        message: 'absent zoneInsight remains undefined',
        setup: async (item) => {
          delete item.zoneInsight
          return item
        },
        assert: (actual) => {
          expect(actual.zoneInsight).toBeUndefined()
        },
      },
      {
        message: 'no subscriptions, connectedSubscription remains undefined, config={}',
        setup: async (item) => {
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions = []
          }
          return item
        },
        assert: (actual) => {
          expect(actual.zoneInsight).toBeDefined()
          expect(actual.zoneInsight?.subscriptions.length).toStrictEqual(0)
          expect(actual.zoneInsight?.connectedSubscription).toBeUndefined()
          expect(actual.zoneInsight?.config).toStrictEqual({})
        },
      },
      {
        message: 'all disconnected subscriptions, connectedSubscription remains undefined, config={}',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.zoneInsight).toBeDefined()
          expect(actual.zoneInsight?.subscriptions.length).toStrictEqual(10)
          expect(actual.zoneInsight?.connectedSubscription).toBeUndefined()
          expect(actual.zoneInsight?.config).toStrictEqual({})
        },
      },
    ] as Test[]).map(map))('$message', run)
  })

  describe('state', () => {
    test.each(([
      {
        message: 'enabled=false, all disconnected subscriptions, state=disabled',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          item.zone.enabled = false
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.state).toStrictEqual('disabled')
        },
      },
      {
        message: 'absent enabled, all disconnected subscriptions, state=offline',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              item.disconnectTime = '2021-03-19T07:06:16.384057Z'
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.state).toStrictEqual('offline')
        },
      },
      {
        message: 'absent enabled, a connected subscription, state=online',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '10',
        },
        setup: async (item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined') {
            item.zoneInsight.subscriptions.forEach((item, i, arr) => {
              item.connectTime = '2021-02-19T07:06:16.384057Z'
              if (i === arr.length - 1) {
                delete item.disconnectTime
              } else {
                item.disconnectTime = '2021-03-19T07:06:16.384057Z'
              }
            })
          }
          return item
        },
        assert: (actual) => {
          expect(actual.state).toStrictEqual('online')
        },
      },
    ] as Test[]).map(map))('$message', run)
  })

  describe('zoneInsight.config', () => {
    test.each(([
      {
        message: 'absent enabled, a connected subscription, config has properties',
        env: {
          KUMA_SUBSCRIPTION_COUNT: '1',
        },
        setup: async (item) => {
          delete item.zone.enabled
          if (typeof item.zoneInsight !== 'undefined' && item.zoneInsight.subscriptions.length === 1) {
            delete item.zoneInsight.subscriptions[0].disconnectTime
          }
          return item
        },
        assert: (actual) => {
          expect(Object.keys(actual.zoneInsight?.config || {}).length > 0).toStrictEqual(true)
        },
      },
    ] as Test[]).map(map))('$message', run)
  })
})
