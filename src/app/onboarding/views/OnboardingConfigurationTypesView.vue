<template>
  <RouteView
    name="onboarding-configuration-types-view"
    v-slot="{ can, t }"
  >
    <RouteTitle
      :title="t('onboarding.routes.configuration-types.title')"
      :render="false"
    />
    <AppView>
      <OnboardingPage with-image>
        <template #header>
          <OnboardingHeading>
            <template #title>
              Learn about configuration storage
            </template>
          </OnboardingHeading>
        </template>

        <template #content>
          <div class="graph-list mb-6">
            <component :is="currentGraphComponent" />
          </div>

          <div class="radio-button-group">
            <KRadio
              v-model="mode"
              name="deployment"
              selected-value="kubernetes"
            >
              Kubernetes
            </KRadio>

            <KRadio
              v-model="mode"
              name="deployment"
              selected-value="postgres"
            >
              Postgres
            </KRadio>

            <KRadio
              v-model="mode"
              name="deployment"
              selected-value="memory"
            >
              Memory
            </KRadio>
          </div>
        </template>

        <template #navigation>
          <OnboardingNavigation
            :next-step="can('use zones') ? 'onboarding-multi-zone-view' : 'onboarding-create-mesh-view'"
            previous-step="onboarding-deployment-types-view"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import KubernetesGraph from '../components/graphs/KubernetesGraph.vue'
import MemoryGraph from '../components/graphs/MemoryGraph.vue'
import PostgresGraph from '../components/graphs/PostgresGraph.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import { useEnv } from '@/app/application'

const env = useEnv()

const componentMap: Record<string, any> = {
  postgres: PostgresGraph,
  memory: MemoryGraph,
  kubernetes: KubernetesGraph,
}

const mode = ref<string>(env('KUMA_STORE_TYPE'))

const currentGraphComponent = computed(() => componentMap[mode.value])
</script>

<style lang="scss" scoped>
.graph-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.radio-button-group {
  display: flex;
  justify-content: center;
  gap: $kui-space-80;
  margin-bottom: $kui-space-60;
}

.radio-button-group .k-radio {
  cursor: pointer;
}
</style>
