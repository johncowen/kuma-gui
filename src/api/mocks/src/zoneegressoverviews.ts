import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const total = fake.datatype.number(10)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'ZoneEgressOverview',
          name,
          creationTime: '2021-07-13T08:40:59Z',
          modificationTime: '2021-07-13T08:40:59Z',
          zoneEgress: {
            zone: 'zone-1',
            networking: {
              address: '10.60.0.16',
              port: 10001,
              admin: {
                port: 9901,
              },
            },
          },
          zoneEgressInsight: {
            subscriptions: [
              {
                id: 'cc2743b5-43e0-45b6-be88-956ea91a4aad',
                controlPlaneInstanceId: 'kuma-control-plane-84f5589874-nmspq-0867',
                connectTime: '2021-07-13T08:41:04.556796688Z',
                generation: 409,
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {
                    responsesSent: '8',
                    responsesAcknowledged: '9',
                  },
                  cds: {
                    responsesSent: '3',
                    responsesAcknowledged: '3',
                  },
                  eds: {
                    responsesSent: '2',
                    responsesAcknowledged: '3',
                  },
                  lds: {
                    responsesSent: '3',
                    responsesAcknowledged: '3',
                  },
                  rds: {},
                },
                version: {
                  kumaDp: {
                    version: '1.2.1',
                    gitTag: '1.2.1',
                    gitCommit: 'e88ec407e669c47d3dc9ef32fcde60e2f31c0c4d',
                    buildDate: '2021-06-30T14:32:58Z',
                  },
                  envoy: {
                    version: '1.18.3',
                    build: '98c1c9e9a40804b93b074badad1cdf284b47d58b/1.18.3/Clean/RELEASE/BoringSSL',
                  },
                },
              },
            ],
          },
        }
      }),
      next: null,
    },
  }
}
