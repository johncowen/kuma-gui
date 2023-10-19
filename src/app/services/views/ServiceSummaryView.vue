<template>
  <RouteView
    v-slot="{ t }"
    name="service-tray-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouterLink
            :to="{
              name: 'service-detail-view',
              params: {
                service: data.name,
              },
            }"
          >
            <RouteTitle
              :title="data.name"
              :render="true"
            />
          </RouterLink>
        </h2>
      </template>

      <div class="stack">
        <template v-if="props.data.serviceType === 'external'">
          <KCard>
            <template #body>
              <ExternalServiceDetails
                v-if="props.data.serviceType === 'external'"
                :mesh="props.data.mesh"
                :service="props.data.name"
              />
            </template>
          </KCard>
          <KCard>
            <template #body>
              <h3>
                {{ t('services.config') }}
              </h3>

              <ExternalServiceConfig
                class="mt-4"
                :mesh="props.data.mesh"
                :service="props.data.name"
              />
            </template>
          </KCard>
        </template>

        <KCard
          v-else
        >
          <template #body>
            <ServiceInsightDetails
              :service-insight="data"
            />
          </template>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ExternalServiceConfig from '../components/ExternalServiceConfig.vue'
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import { ServiceInsight } from '@/types/index.d'

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
