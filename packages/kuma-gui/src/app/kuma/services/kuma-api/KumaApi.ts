import { Api } from './Api'
import type {
  ApiKindListResponse,
  DataPlaneOverviewParameters,
  ExternalServicesParameters,
  PaginatedApiListResponse,
  PaginationParameters,
  ServiceInsightsParameters,
  SingleResourceParameters,
} from '@/types/api.d'
import type {
  DataPlane,
  DataPlaneOverview,
  ExternalService,
  InspectRulesForDataplane,
  MeshGateway,
  MeshGatewayDataplane,
  PolicyDataplane,
  PolicyEntity,
  ServiceInsight,
  SidecarDataplane,
  Zone,
  ZoneEgress,
  ZoneEgressOverview,
  ZoneIngress,
  ZoneIngressOverview,
  ZoneOverview,
} from '@/types/index.d'


export default class KumaApi extends Api {

  getAllServiceInsights(params?: ServiceInsightsParameters): Promise<PaginatedApiListResponse<ServiceInsight>> {
    return this.client.get('/service-insights', { params })
  }

  getAllServiceInsightsFromMesh({ mesh }: { mesh: string }, params?: ServiceInsightsParameters): Promise<PaginatedApiListResponse<ServiceInsight>> {
    return this.client.get(`/meshes/${mesh}/service-insights`, { params })
  }

  getServiceInsight({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ServiceInsight> {
    return this.client.get(`/meshes/${mesh}/service-insights/${name}`, { params })
  }

  getAllExternalServices(params?: ExternalServicesParameters): Promise<PaginatedApiListResponse<ExternalService>> {
    return this.client.get('/external-services', { params })
  }

  getAllExternalServicesFromMesh({ mesh }: { mesh: string }, params?: ExternalServicesParameters): Promise<PaginatedApiListResponse<ExternalService>> {
    return this.client.get(`/meshes/${mesh}/external-services`, { params })
  }

  getExternalService({ mesh, name }: { mesh: string, name: string }, params?: SingleResourceParameters): Promise<ExternalService> {
    return this.client.get(`/meshes/${mesh}/external-services/${name}`, { params })
  }

  getZones(params?: PaginationParameters): Promise<PaginatedApiListResponse<Zone>> {
    return this.client.get('/zones', { params })
  }

  getZone({ name }: { name: string }, params?: SingleResourceParameters): Promise<Zone> {
    return this.client.get(`/zones/${name}`, { params })
  }

  getAllZoneOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneOverview>> {
    return this.client.get('/zones/_overview', { params })
  }

  getZoneOverview({ name }: { name: string }, params?: any): Promise<ZoneOverview> {
    return this.client.get(`/zones/${name}/_overview`, { params })
  }

  getZoneIngress({ name }: { name: string }, params?: any): Promise<ZoneIngress> {
    return this.client.get(`/zone-ingresses/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneIngressData({ zoneIngressName, dataPath }: { zoneIngressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`/zoneingresses/${zoneIngressName}/${dataPath}`, { params })
  }

  getZoneIngressXds({ name }: { name: string, params?: any }, params?: any): Promise<Record<string, unknown>> {
    return this.client.get(`/zoneingresses/${name}/xds`, { params })
  }

  getZoneIngressStats({ name }: { name: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/zoneingresses/${name}/stats`, { params })
  }

  getZoneIngressClusters({ name }: { name: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/zoneingresses/${name}/clusters`, { params })
  }


  getAllZoneIngressOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneIngressOverview>> {
    return this.client.get('/zone-ingresses/_overview', { params })
  }

  getZoneIngressOverview({ name }: { name: string }, params?: any): Promise<ZoneIngressOverview> {
    return this.client.get(`/zone-ingresses/${name}/_overview`, { params })
  }

  getZoneEgress({ name }: { name: string }, params?: any): Promise<ZoneEgress> {
    return this.client.get(`/zoneegresses/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneEgressData({ zoneEgressName, dataPath }: { zoneEgressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`/zoneegresses/${zoneEgressName}/${dataPath}`, { params })
  }

  getZoneEgressXds({ name }: { name: string, params?: any }, params?: any): Promise<Record<string, unknown>> {
    return this.client.get(`/zoneegresses/${name}/xds`, { params })
  }

  getZoneEgressStats({ name }: { name: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/zoneegresses/${name}/stats`, { params })
  }

  getZoneEgressClusters({ name }: { name: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/zoneegresses/${name}/clusters`, { params })
  }

  getAllZoneEgressOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneEgressOverview>> {
    return this.client.get('/zoneegresses/_overview', { params })
  }

  getZoneEgressOverview({ name }: { name: string }, params?: any): Promise<ZoneEgressOverview> {
    return this.client.get(`/zoneegresses/${name}/_overview`, { params })
  }

  getAllDataplanes(params?: PaginationParameters): Promise<PaginatedApiListResponse<DataPlane>> {
    return this.client.get('/dataplanes', { params })
  }

  getDataplaneFromMesh({ mesh, name }: { mesh: string, name: string }, params?: SingleResourceParameters): Promise<DataPlane> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}`, { params })
  }

  getAllDataplaneOverviews(params?: DataPlaneOverviewParameters): Promise<PaginatedApiListResponse<DataPlaneOverview>> {
    return this.client.get('/dataplanes/_overview', { params })
  }

  getAllDataplaneOverviewsFromMesh({ mesh }: { mesh: string }, params?: DataPlaneOverviewParameters): Promise<PaginatedApiListResponse<DataPlaneOverview>> {
    return this.client.get(`/meshes/${mesh}/dataplanes/_overview`, { params })
  }

  getDataplaneOverviewFromMesh({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<DataPlaneOverview> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}/_overview`, { params })
  }

  getSidecarDataplanePolicies({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ApiKindListResponse<SidecarDataplane>> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}/policies`, { params })
  }

  getMeshGatewayDataplane({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<MeshGatewayDataplane> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}/policies`, { params })
  }

  getDataplaneRules({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<InspectRulesForDataplane> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}/_rules`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getDataplaneData({ mesh, dppName, dataPath }: { mesh: string, dppName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/${dataPath}`, { params })
  }

  getDataplaneXds({ mesh, dppName }: { mesh: string, dppName: string, params?: any }, params?: any): Promise<Record<string, unknown>> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/xds`, { params })
  }

  getDataplaneStats({ mesh, dppName }: { mesh: string, dppName: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/stats`, { params })
  }

  getDataplaneClusters({ mesh, dppName }: { mesh: string, dppName: string, params?: any }, params?: any): Promise<string> {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/clusters`, { params })
  }





  getPolicyConnections({ mesh, path, name }: { mesh: string, path: string, name: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<PolicyDataplane>> {
    return this.client.get(`/meshes/${mesh}/${path}/${name}/_resources/dataplanes`, { params })
  }

  getAllPolicyEntitiesFromMesh({ mesh, path }: { mesh: string, path: string }, params?: PaginationParameters & { name?: string }): Promise<PaginatedApiListResponse<PolicyEntity>> {
    return this.client.get(`/meshes/${mesh}/${path}`, { params })
  }

  getSinglePolicyEntity({ mesh, path, name }: { mesh: string, path: string, name: string }, params?: SingleResourceParameters): Promise<PolicyEntity> {
    return this.client.get(`/meshes/${mesh}/${path}/${name}`, { params })
  }

  getAllMeshGatewaysFromMesh({ mesh }: { mesh: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<MeshGateway>> {
    return this.client.get(`/meshes/${mesh}/meshgateways`, { params })
  }

  getMeshGateway({ mesh, name }: { mesh: string, name: string }, params?: SingleResourceParameters): Promise<MeshGateway> {
    return this.client.get(`/meshes/${mesh}/meshgateways/${name}`, { params })
  }

  getMeshGatewayRules({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<InspectRulesForDataplane> {
    return this.client.get(`/meshes/${mesh}/meshgateways/${name}/_rules`, { params })
  }
}
