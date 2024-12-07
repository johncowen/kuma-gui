<template>
  <RouteView
    name="zone-ingress-detail-view"
    :params="{
      subscription: '',
      zoneIngress: '',
    }"
    v-slot="{ t, me, route }"
  >
    <AppView>
      <div
        class="stack"
      >
        <KCard>
          <XLayout
            type="stack"
          >
            <XTimespan
              :start="t('common.formats.datetime', { value: Date.parse(props.data.creationTime) })"
              :end="t('common.formats.datetime', { value: Date.parse(props.data.modificationTime) })"
            />
            <div class="columns">
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge
                    :status="props.data.state"
                  />
                </template>
              </DefinitionCard>

              <DefinitionCard
                v-if="props.data.namespace.length > 0"
              >
                <template #title>
                  Namespace
                </template>

                <template #body>
                  {{ props.data.namespace }}
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <template
                    v-if="props.data.zoneIngress.socketAddress.length > 0"
                  >
                    <XCopyButton
                      :text="props.data.zoneIngress.socketAddress"
                    />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.advertisedAddress') }}
                </template>

                <template #body>
                  <template
                    v-if="props.data.zoneIngress.advertisedSocketAddress.length > 0"
                  >
                    <XCopyButton
                      :text="props.data.zoneIngress.advertisedSocketAddress"
                    />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </XLayout>
        </KCard>

        <div
          v-if="props.data.zoneIngressInsight.subscriptions.length > 0"
        >
          <h2>{{ t('zone-ingresses.routes.item.subscriptions.title') }}</h2>
          <AppCollection
            :headers="[
              { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
              { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
              { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
              { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
              { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
            ]"
            :is-selected-row="item => item.id === route.params.subscription"
            :items="props.data.zoneIngressInsight.subscriptions.map((_, i, arr) => arr[arr.length - (i + 1)])"
            @resize="me.set"
          >
            <template
              #instanceId="{ row: item }"
            >
              <XAction
                data-action
                :to="{
                  name: 'zone-ingress-subscription-summary-view',
                  params: {
                    subscription: item.id,
                  },
                }"
              >
                {{ item.controlPlaneInstanceId }}
              </XAction>
            </template>
            <template
              #version="{ row: item }"
            >
              {{ item.version?.kumaDp?.version ?? '-' }}
            </template>
            <template
              #connected="{ row: item }"
            >
              {{ t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') }) }}
            </template>
            <template
              #disconnected="{ row: item }"
            >
              <template
                v-if="item.disconnectTime"
              >
                {{ t('common.formats.datetime', { value: Date.parse(item.disconnectTime) }) }}
              </template>
            </template>
            <template
              #responses="{ row: item }"
            >
              <template
                v-for="responses in [item.status?.total ?? {}]"
              >
                {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
              </template>
            </template>
          </AppCollection>
          <RouterView
            v-slot="{ Component }"
          >
            <SummaryView
              v-if="route.child()"
              width="670px"
              @close="function () {
                route.replace({
                  name: 'zone-ingress-detail-view',
                  params: {
                    zoneIngress: route.params.zoneIngress,
                  },
                })
              }"
            >
              <component
                :is="Component"
                :data="props.data.zoneIngressInsight.subscriptions"
              />
            </SummaryView>
          </RouterView>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'

const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
