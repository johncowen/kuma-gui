<template>
  <RouteView
    name="mesh-external-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, can }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.service"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <XAction
                :to="{
                  name: 'mesh-external-service-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    service: route.params.service,
                  },

                }"
              >
                <RouteTitle
                  :title="t('services.routes.item.title', { name: item.name })"
                />
              </XAction>
            </h2>
          </template>

          <div
            class="stack"
          >
            <div
              class="stack-with-borders"
            >
              <DefinitionCard
                v-if="item.namespace.length > 0"
                layout="horizontal"
              >
                <template #title>
                  Namespace
                </template>

                <template #body>
                  {{ item.namespace }}
                </template>
              </DefinitionCard>
              <DefinitionCard
                v-if="can('use zones') && item.zone"
                layout="horizontal"
              >
                <template
                  #title
                >
                  Zone
                </template>
                <template
                  #body
                >
                  <XAction
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: item.zone,
                      },
                    }"
                  >
                    {{ item.zone }}
                  </XAction>
                </template>
              </DefinitionCard>
              <DefinitionCard
                v-if="item.spec.match"
                layout="horizontal"
              >
                <template
                  #title
                >
                  Port
                </template>
                <template
                  #body
                >
                  <KumaPort
                    :port="item.spec.match"
                  />
                </template>
              </DefinitionCard>
              <DefinitionCard
                layout="horizontal"
              >
                <template
                  #title
                >
                  TLS
                </template>
                <template
                  #body
                >
                  <KBadge
                    appearance="neutral"
                  >
                    {{ item.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
                  </KBadge>
                </template>
              </DefinitionCard>
            </div>
            <div>
              <h3>
                {{ t('services.routes.item.config') }}
              </h3>

              <div class="mt-4">
                <ResourceCodeBlock
                  :resource="item.config"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                  v-slot="{ copy, copying }"
                >
                  <DataSource
                    v-if="copying"
                    :src="`/meshes/${route.params.mesh}/mesh-service/${route.params.service}/as/kubernetes?no-store`"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </div>
            </div>
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { MeshExternalService } from '@/app/services/data'
const props = defineProps<{
  items: MeshExternalService[]
}>()
</script>
