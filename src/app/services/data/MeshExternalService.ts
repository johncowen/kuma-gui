import type { components } from '@/types/auto-generated.d'
type GeneratedMeshExternalService = components['schemas']['MeshExternalServiceItem']
type GeneratedMeshExternalServiceList = components['responses']['MeshExternalServiceList']['content']['application/json']

export const MeshExternalService = {
  fromObject(item: GeneratedMeshExternalService) {
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

  fromCollection(collection: GeneratedMeshExternalServiceList) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshExternalService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshExternalService = ReturnType<typeof MeshExternalService['fromObject']>
