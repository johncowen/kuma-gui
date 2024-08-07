<template>
  <RouteView
    name="service-config-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('services.routes.item.navigation.service-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <div>
          <DataSource
            :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
            v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
          >
            <ErrorBlock
              v-if="externalServiceError"
              :error="externalServiceError"
            />

            <LoadingBlock v-else-if="externalService === undefined" />

            <EmptyBlock
              v-else-if="externalService === null"
              data-testid="no-matching-external-service"
            >
              <template #title>
                {{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}
              </template>
            </EmptyBlock>

            <ResourceCodeBlock
              v-else
              :resource="externalService.config"
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
                :src="`/meshes/${externalService.mesh}/external-service/${externalService.name}/as/kubernetes?no-store`"
                @change="(data) => {
                  copy((resolve) => resolve(data))
                }"
                @error="(e) => {
                  copy((_resolve, reject) => reject(e))
                }"
              />
            </ResourceCodeBlock>
          </DataSource>
        </div>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
</script>
