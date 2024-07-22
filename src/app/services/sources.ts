import createClient from 'openapi-fetch'

import {
  MeshService,
  MeshMultizoneService,
  MeshExternalService,
  ExternalService,
  ServiceInsight,
} from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ServiceInsightsParameters } from '@/types/api.d'
import type { paths } from '@/types/auto-generated.d'

export type { ServiceInsight } from './data'

export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export type ExternalServiceSource = DataSourceResponse<ExternalService | null>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/mesh-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const res = await http.GET('/meshes/{mesh}/meshservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
          },
        },
      })

      return MeshService.fromCollection(res.data!)
    },

    '/meshes/:mesh/mesh-service/:name': async (params) => {
      const { mesh, name } = params

      const res = await http.GET('/meshes/{mesh}/meshservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return MeshService.fromObject(res.data!)
    },

    '/meshes/:mesh/mesh-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/meshservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data!
    },

    '/meshes/:mesh/mesh-multizone-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const res = await http.GET('/meshes/{mesh}/meshmultizoneservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
          },
        },
      })

      return MeshMultizoneService.fromCollection(res.data!)
    },

    '/meshes/:mesh/mesh-multizone-service/:name': async (params) => {
      const { mesh, name } = params

      const res = await http.GET('/meshes/{mesh}/meshmultizoneservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return MeshMultizoneService.fromObject(res.data!)
    },

    '/meshes/:mesh/mesh-multizone-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/meshmultizoneservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data!
    },

    '/meshes/:mesh/mesh-external-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const res = await http.GET('/meshes/{mesh}/meshexternalservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
          },
        },
      })
      return MeshExternalService.fromCollection(res.data!)
    },

    '/meshes/:mesh/mesh-external-service/:name': async (params) => {
      const { mesh, name } = params

      const res = await http.GET('/meshes/{mesh}/meshexternalservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })

      return MeshExternalService.fromObject(res.data!)
    },

    '/meshes/:mesh/mesh-external-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      const res = await http.GET('/meshes/{mesh}/meshexternalservices/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data!
    },

    '/meshes/:mesh/service-insights/of/:serviceType': async (params) => {
      const { mesh, size, serviceType } = params
      const offset = params.size * (params.page - 1)

      const filterParams: ServiceInsightsParameters = {
        size,
        offset,
      }

      if (serviceType !== 'all') {
        filterParams.type = serviceType
      }

      return ServiceInsight.fromCollection(await api.getAllServiceInsightsFromMesh({ mesh }, filterParams))
    },

    '/meshes/:mesh/service-insights/:name': async (params) => {
      const { mesh, name } = params

      return ServiceInsight.fromObject(await api.getServiceInsight({ mesh, name }))
    },

    // TODO: Remove this when removing external services from the Services tab.
    '/meshes/:mesh/external-services/for/:service': async (params) => {
      const { mesh, service } = params

      const { items } = await api.getAllExternalServicesFromMesh({ mesh }, {
        tag: [`kuma.io/service:${service}`],
      })

      return items.length > 0 ? ExternalService.fromObject(items[0]) : null
    },

    // TODO: Remove this when removing external services from the Services tab.
    '/meshes/:mesh/external-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getExternalService({ mesh, name }, {
        format: 'kubernetes',
      })
    },
  })
}
