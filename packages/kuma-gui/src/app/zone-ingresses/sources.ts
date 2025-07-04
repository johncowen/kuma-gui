import { TarWriter } from '@gera2ld/tarjs'

import { ZoneIngressOverview, ZoneIngress } from './data'
import { YAML } from '@/app/application'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/zone-cps/:name/ingresses': async (params) => {
      const { name, size, page } = params
      const filter = {
        [`labels.${'kuma.io/zone'}`]: name,
      }
      const search = ZoneIngressOverview.search(params.search)
      const offset = size * (page - 1)

      const res = await api.getAllZoneIngressOverviews({ size, offset, filter, ...search })
      return ZoneIngressOverview.fromCollection(res)
    },

    '/zone-ingresses/:name': async (params) => {
      const { name } = params

      return ZoneIngress.fromObject(await api.getZoneIngress({ name }))
    },

    '/zone-ingresses/:name/data-path/:dataPath': (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'
      return api.getZoneIngressData({ zoneIngressName: name, dataPath })
    },

    '/zone-ingresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      return await api.getZoneIngress({ name }, { format: 'kubernetes' })
    },

    '/zone-ingresses/:name/as/tarball/:spec': async (params) => {
      const { name } = params
      const spec = JSON.parse(params.spec)
      const requests = Object.entries(spec).filter(([_, value]) => {
        return value
      }).reduce((prev, [key]) => {
        switch (key) {
          case 'proxy':
            prev.push(async () => {
              return {
                name: 'zone-ingress.yaml',
                content: YAML.stringify(await api.getZoneIngress({ name })),
              }
            })
            break
          case 'xds':
            prev.push(async () => {
              return {
                name: 'xds.json',
                content: JSON.stringify(await api.getZoneIngressXds({
                  name,
                }, {
                  include_eds: spec.eds,
                }), null, 2),
              }
            })
            break
          case 'stats':
            prev.push(async () => {
              return {
                name: 'stats.txt',
                content: await api.getZoneIngressStats({
                  name,
                }),
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              return {
                name: 'clusters.txt',
                content: await api.getZoneIngressClusters({
                  name,
                }),
              }
            })
            break
        }
        return prev
      }, [] as (() => Promise<{ name: string, content: string }>)[])

      const files = await Promise.all(requests.map(item => item()))
      const tarball = new TarWriter()
      const id = `${name}`
      files.forEach(({ name, content }) => {
        tarball.addFile(`${id}/${name}`, content)
      })
      return {
        name: `${id}.tar`,
        url: URL.createObjectURL(new Blob([await tarball.write()], { type: 'application/tar' })),
      }
    },


    '/zone-ingress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return ZoneIngressOverview.fromCollection(await api.getAllZoneIngressOverviews({ size, offset }))
    },

    '/zone-ingress-overviews/:name': async (params) => {
      const { name } = params

      return ZoneIngressOverview.fromObject(await api.getZoneIngressOverview({ name }))
    },
  })
}
