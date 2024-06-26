<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, uri }"
      name="service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        service: '',
      }"
    >
      <AppView>
        <template #title>
          <XTeleportTemplate
            :to="{ name: 'service-list-tabs-view-title'}"
          >
            <h2>
              <RouteTitle
                :title="t(`services.routes.items.title`)"
              />
            </h2>
          </XTeleportTemplate>
        </template>
        <KCard>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/service-insights/of/:serviceType', {
              mesh: route.params.mesh,
              serviceType: 'internal',
            },{
              page: route.params.page,
              size: route.params.size,
            })"
          >
            <template
              #loadable="{ data }"
            >
              <DataCollection
                type="services"
                :items="data?.items ?? [undefined]"
              >
                <AppCollection
                  class="service-collection"
                  data-testid="service-collection"
                  :headers="[
                    { label: 'Name', key: 'name' },
                    { label: 'Address', key: 'addressPort' },
                    { label: 'DP proxies (online / total)', key: 'online' },
                    { label: 'Status', key: 'status' },
                    { label: 'Details', key: 'details', hideLabel: true },
                  ]"
                  :page-number="route.params.page"
                  :page-size="route.params.size"
                  :total="data?.total"
                  :items="data?.items"
                  :is-selected-row="(row) => row.name === route.params.service"
                  @change="route.update"
                >
                  <template #name="{ row: item }">
                    <TextWithCopyButton :text="item.name">
                      <XAction
                        :to="{
                          name: 'service-detail-view',
                          params: {
                            mesh: item.mesh,
                            service: item.name,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                          },
                        }"
                      >
                        {{ item.name }}
                      </XAction>
                    </TextWithCopyButton>
                  </template>

                  <template #addressPort="{ row }">
                    <TextWithCopyButton
                      v-if="row.addressPort"
                      :text="row.addressPort"
                    />

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #online="{ row: item }">
                    <template
                      v-if="item.dataplanes"
                    >
                      {{ item.dataplanes.online || 0 }} / {{ item.dataplanes.total || 0 }}
                    </template>
                    <template
                      v-else
                    >
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #status="{ row: item }">
                    <StatusBadge :status="item.status" />
                  </template>

                  <template #details="{ row }">
                    <XAction
                      class="details-link"
                      data-testid="details-link"
                      :to="{
                        name: 'service-detail-view',
                        params: {
                          mesh: row.mesh,
                          service: row.name,
                        },
                      }"
                    >
                      {{ t('common.collection.details_link') }}

                      <ArrowRightIcon
                        decorative
                        :size="KUI_ICON_SIZE_30"
                      />
                    </XAction>
                  </template>
                </AppCollection>
                <RouterView
                  v-if="route.params.service"
                  v-slot="child"
                >
                  <SummaryView
                    @close="route.replace({
                      name: 'service-list-view',
                      params: {
                        mesh: route.params.mesh,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                      },
                    })"
                  >
                    <component
                      :is="child.Component"
                      :name="route.params.service"
                      :service="data?.items.find((item) => item.name === route.params.service)"
                    />
                  </SummaryView>
                </RouterView>
              </DataCollection>
            </template>
          </DataLoader>
        </KCard>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
