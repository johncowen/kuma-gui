<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-cp-config-view"
    :params="{
      zone: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template
        v-if="props.notifications.length > 0"
        #notifications
      >
        <ul>
          <li
            v-for="warning in props.notifications"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"

            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
        </ul>
      </template>

      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-cps.routes.item.navigation.zone-cp-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <CodeBlock
          v-if="Object.keys(props.data.zoneInsight.config).length > 0"
          language="json"
          :code="JSON.stringify(props.data.zoneInsight.config, null, 2)"
          is-searchable
          :query="route.params.codeSearch"
          :is-filter-mode="route.params.codeFilter"
          :is-reg-exp-mode="route.params.codeRegExp"
          @query-change="route.update({ codeSearch: $event })"
          @filter-mode-change="route.update({ codeFilter: $event })"
          @reg-exp-mode-change="route.update({ codeRegExp: $event })"
        />

        <KAlert
          v-else
          class="mt-4"
          data-testid="warning-no-subscriptions"
          appearance="warning"
        >
          {{ t('zone-cps.detail.no_subscriptions') }}
        </KAlert>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'

const props = withDefaults(defineProps<{
  data: ZoneOverview
  notifications: { kind: string, payload: Record<string, string> }[]
}>(), {
  notifications: () => [],
})
</script>
