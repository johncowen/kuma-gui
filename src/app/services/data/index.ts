import type { PaginatedApiListResponse } from '@/types/api.d'
import type { components } from '@/types/auto-generated.d'
import type {
  MeshService as PartialMeshService,
  ExternalService as PartialExternalService,
  ServiceInsight as PartialServiceInsight,
  ServiceStatus as ServiceTypeCount,
} from '@/types/index.d'

type PartialMeshExternalService = components['schemas']['MeshExternalServiceItem']
type PartialMeshExternalServiceList = components['responses']['MeshExternalServiceList']['content']['application/json']
type PagedCollection<T> = {
  total: number
  items: T[]
  // @TODO(jc): generated types current think next is `next?: string` which is
  // wrong but seeing as we never use `next` :shrug:
  // next: string | null
}

export type ExternalService = PartialExternalService & {
  config: PartialExternalService
}
export type MeshService = Omit<PartialMeshService, 'spec' | 'status'> & {
  id: string
  namespace: string
  labels: NonNullable<PartialMeshService['labels']>
  spec: {
    ports: NonNullable<PartialMeshService['spec']['ports']>
    selector: {
      dataplaneTags: NonNullable<NonNullable<PartialMeshService['spec']['selector']>['dataplaneTags']>
    }
  }
  status: {
    addresses: NonNullable<PartialMeshService['status']['addresses']>
    vips: NonNullable<PartialMeshService['status']['vips']>
    tls: NonNullable<PartialMeshService['status']['tls']>
  }
  config: PartialMeshService
}
export type MeshExternalService = Omit<PartialMeshExternalService, 'status'> & {
  id: string
  namespace: string
  labels: NonNullable<PartialMeshExternalService['labels']>
  config: PartialMeshExternalService
  status: {
    addresses: NonNullable<NonNullable<PartialMeshExternalService['status']>['addresses']>
    vip?: NonNullable<PartialMeshExternalService['status']>['vip']
  }
}

export type ServiceInsight = PartialServiceInsight & {
  serviceType: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
  status: 'online' | 'offline' | 'partially_degraded' | 'not_available'
}

export const ExternalService = {
  fromObject(partialExternalService: PartialExternalService): ExternalService {
    return {
      ...partialExternalService,
      config: partialExternalService,
    }
  },
}

export const ServiceInsight = {
  fromObject(partialServiceInsight: PartialServiceInsight): ServiceInsight {
    const serviceType = partialServiceInsight.serviceType ?? 'internal'
    const status = partialServiceInsight.status ?? 'not_available'

    return {
      ...partialServiceInsight,
      serviceType,
      status,
    }
  },

  fromCollection(partialServiceInsights: PaginatedApiListResponse<PartialServiceInsight>): PaginatedApiListResponse<ServiceInsight> {
    return {
      ...partialServiceInsights,
      items: Array.isArray(partialServiceInsights.items)
        ? partialServiceInsights.items.map((partialServiceInsight) => ServiceInsight.fromObject(partialServiceInsight))
        : [],
    }
  },
}
export const MeshService = {
  fromObject(item: PartialMeshService): MeshService {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    return {
      ...item,
      config: item,
      id: item.name,
      name,
      namespace,
      labels,
      spec: ((item = {}) => {
        return {
          ports: Array.isArray(item.ports) ? item.ports : [],
          selector: ((item = {}) => {
            return {
              dataplaneTags: Object.keys(item.dataplaneTags ?? {}).length > 0 ? item.dataplaneTags! : {},
            }
          })(item.selector),
        }
      })(item.spec),
      status: ((item = {}) => {
        return {
          tls: typeof item.tls !== 'undefined' ? item.tls : { status: '' },
          vips: Array.isArray(item.vips) ? item.vips : [],
          addresses: Array.isArray(item.addresses) ? item.addresses : [],
        }
      })(item.status),
    }
  },

  fromCollection(collection: PaginatedApiListResponse<PartialMeshService>): PaginatedApiListResponse<MeshService> {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export const MeshExternalService = {
  fromObject(item: PartialMeshExternalService): MeshExternalService {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    return {
      ...item,
      config: item,
      id: item.name,
      name,
      namespace,
      labels,
      status: ((item = {}) => {
        return {
          ...item,
          addresses: Array.isArray(item.addresses) ? item.addresses : [],
        }
      })(item.status),

    }
  },

  fromCollection(collection: PartialMeshExternalServiceList): PagedCollection<MeshExternalService> {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshExternalService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export function getServiceTypeCount({ total = 0, internal = 0, external = 0 }: ServiceTypeCount): Required<ServiceTypeCount> {
  return {
    total,
    internal,
    external,
  }
}
