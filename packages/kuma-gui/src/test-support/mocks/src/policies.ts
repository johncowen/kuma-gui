import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      policies: [
        {
          name: 'CircuitBreaker',
          readOnly: true,
          path: 'circuit-breakers',
          singularDisplayName: 'Circuit Breaker',
          pluralDisplayName: 'Circuit Breakers',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'FaultInjection',
          readOnly: true,
          path: 'fault-injections',
          singularDisplayName: 'Fault Injection',
          pluralDisplayName: 'Fault Injections',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'HealthCheck',
          readOnly: true,
          path: 'health-checks',
          singularDisplayName: 'Health Check',
          pluralDisplayName: 'Health Checks',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshAccessLog',
          readOnly: true,
          path: 'meshaccesslogs',
          singularDisplayName: 'Mesh Access Log',
          pluralDisplayName: 'Mesh Access Logs',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: true,
        },
        {
          name: 'MeshCircuitBreaker',
          readOnly: true,
          path: 'meshcircuitbreakers',
          singularDisplayName: 'Mesh Circuit Breaker',
          pluralDisplayName: 'Mesh Circuit Breakers',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: true,
        },
        {
          name: 'MeshFaultInjection',
          readOnly: true,
          path: 'meshfaultinjections',
          singularDisplayName: 'Mesh Fault Injection',
          pluralDisplayName: 'Mesh Fault Injections',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: true,
        },
        {
          name: 'MeshGatewayRoute',
          readOnly: true,
          path: 'meshgatewayroutes',
          singularDisplayName: 'Mesh Gateway Route',
          pluralDisplayName: 'Mesh Gateway Routes',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshHTTPRoute',
          readOnly: true,
          path: 'meshhttproutes',
          singularDisplayName: 'Mesh HTTP Route',
          pluralDisplayName: 'Mesh HTTP Routes',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: true,
        },
        {
          name: 'MeshHealthCheck',
          readOnly: true,
          path: 'meshhealthchecks',
          singularDisplayName: 'Mesh Health Check',
          pluralDisplayName: 'Mesh Health Checks',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: true,
        },
        {
          name: 'MeshLoadBalancingStrategy',
          readOnly: true,
          path: 'meshloadbalancingstrategies',
          singularDisplayName: 'Mesh Load Balancing Strategy',
          pluralDisplayName: 'Mesh Load Balancing Strategies',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: true,
        },
        {
          name: 'MeshMetric',
          readOnly: true,
          path: 'meshmetrics',
          singularDisplayName: 'Mesh Metric',
          pluralDisplayName: 'Mesh Metrics',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshPassthrough',
          readOnly: true,
          path: 'meshpassthroughs',
          singularDisplayName: 'Mesh Passthrough',
          pluralDisplayName: 'Mesh Passthroughs',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshProxyPatch',
          readOnly: true,
          path: 'meshproxypatches',
          singularDisplayName: 'Mesh Proxy Patch',
          pluralDisplayName: 'Mesh Proxy Patches',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshRateLimit',
          readOnly: true,
          path: 'meshratelimits',
          singularDisplayName: 'Mesh Rate Limit',
          pluralDisplayName: 'Mesh Rate Limits',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: true,
        },
        {
          name: 'MeshRetry',
          readOnly: true,
          path: 'meshretries',
          singularDisplayName: 'Mesh Retry',
          pluralDisplayName: 'Mesh Retries',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: true,
        },
        {
          name: 'MeshTCPRoute',
          readOnly: true,
          path: 'meshtcproutes',
          singularDisplayName: 'Mesh TCP Route',
          pluralDisplayName: 'Mesh TCP Routes',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: true,
        },
        {
          name: 'MeshTLS',
          readOnly: true,
          path: 'meshtlses',
          singularDisplayName: 'Mesh TLS',
          pluralDisplayName: 'Mesh TLSes',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: false,
        },
        {
          name: 'MeshTimeout',
          readOnly: true,
          path: 'meshtimeouts',
          singularDisplayName: 'Mesh Timeout',
          pluralDisplayName: 'Mesh Timeouts',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: true,
        },
        {
          name: 'MeshTrace',
          readOnly: true,
          path: 'meshtraces',
          singularDisplayName: 'Mesh Trace',
          pluralDisplayName: 'Mesh Traces',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'MeshTrafficPermission',
          readOnly: true,
          path: 'meshtrafficpermissions',
          singularDisplayName: 'Mesh Traffic Permission',
          pluralDisplayName: 'Mesh Traffic Permissions',
          isExperimental: false,
          isTargetRefBased: true,
          isInbound: true,
          isOutbound: false,
        },
        {
          name: 'ProxyTemplate',
          readOnly: true,
          path: 'proxytemplates',
          singularDisplayName: 'Proxy Template',
          pluralDisplayName: 'Proxy Templates',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'RateLimit',
          readOnly: true,
          path: 'rate-limits',
          singularDisplayName: 'Rate Limit',
          pluralDisplayName: 'Rate Limits',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'Retry',
          readOnly: true,
          path: 'retries',
          singularDisplayName: 'Retry',
          pluralDisplayName: 'Retries',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'Timeout',
          readOnly: true,
          path: 'timeouts',
          singularDisplayName: 'Timeout',
          pluralDisplayName: 'Timeouts',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'TrafficLog',
          readOnly: true,
          path: 'traffic-logs',
          singularDisplayName: 'Traffic Log',
          pluralDisplayName: 'Traffic Logs',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'TrafficPermission',
          readOnly: true,
          path: 'traffic-permissions',
          singularDisplayName: 'Traffic Permission',
          pluralDisplayName: 'Traffic Permissions',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'TrafficRoute',
          readOnly: true,
          path: 'traffic-routes',
          singularDisplayName: 'Traffic Route',
          pluralDisplayName: 'Traffic Routes',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'TrafficTrace',
          readOnly: true,
          path: 'traffic-traces',
          singularDisplayName: 'Traffic Trace',
          pluralDisplayName: 'Traffic Traces',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
        {
          name: 'VirtualOutbound',
          readOnly: true,
          path: 'virtual-outbounds',
          singularDisplayName: 'Virtual Outbound',
          pluralDisplayName: 'Virtual Outbounds',
          isExperimental: false,
          isTargetRefBased: false,
          isInbound: false,
          isOutbound: false,
        },
      ],
    },
  }
}
