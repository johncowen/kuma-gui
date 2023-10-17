<template>
  <div>
    <h3>{{ t('services.overview') }}</h3>

    <div class="mt-4">
      <ExternalServiceDetails
        v-if="props.data.serviceType === 'external'"
        :mesh="props.data.mesh"
        :service="props.data.name"
      />

      <ServiceInsightDetails
        v-else
        :service-insight="data"
      />
    </div>

    <template v-if="props.data.serviceType === 'external'">
      <h3>{{ t('services.config') }}</h3>

      <ExternalServiceConfig
        class="mt-4"
        :mesh="props.data.mesh"
        :service="props.data.name"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ExternalServiceConfig from '../components/ExternalServiceConfig.vue'
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
