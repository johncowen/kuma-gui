<template>
  <component
    :is="shouldTruncate ? 'KTruncate' : 'div'"
    :width="shouldTruncate ? 'auto' : undefined"
    :class="{
      'tag-list': !shouldTruncate,
      'tag-list--align-right': props.alignment === 'right',
    }"
  >
    <KBadge
      v-for="(tag, index) in tagList"
      :key="index"
      max-width="auto"
      class="tag"
      :appearance="tag.isKuma ? 'info' : 'neutral'"
    >
      <component
        :is="tag.route ? 'RouterLink' : 'span'"
        :to="tag.route"
      >
        {{ tag.label }}:<b>{{ tag.value }}</b>
      </component>
    </KBadge>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { LabelValue, Tags } from '@/types/index.d'
import type { RouteLocationNamedRaw } from 'vue-router'

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocationNamedRaw | undefined
  isKuma: boolean
}

const props = withDefaults(defineProps<{
  tags: LabelValue[] | Tags | null | undefined
  shouldTruncate?: boolean
  alignment?: 'left' | 'right'
}>(), {
  shouldTruncate: false,
  alignment: 'left',
})

const tagList = computed<LabelValueWithRoute[]>(() => {
  const labels = Array.isArray(props.tags) ? props.tags : Object.entries(props.tags ?? {}).map(([label, value]) => ({ label, value }))

  return labels.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)
    const isKuma = label.includes('.kuma.io/') || label.startsWith('kuma.io/')

    return { label, value, route, isKuma }
  })
})
const shouldTruncate = computed(() => props.shouldTruncate || Object.keys(tagList.value).length > 10)

function getRoute(tag: LabelValue): RouteLocationNamedRaw | undefined {
  // Wildcard tag values don’t refer to specific entities we can link to.
  if (tag.value === '*') {
    return undefined
  }

  switch (tag.label) {
    case 'kuma.io/zone': {
      return {
        name: 'data-plane-list-view',
        query: {
          s: `zone:${tag.value}`,
        },
      }
    }
    case 'kuma.io/service': {
      return {
        name: 'data-plane-list-view',
        query: {
          s: `service:${tag.value}`,
        },
      }
    }
    case 'kuma.io/mesh': {
      return {
        name: 'mesh-detail-view',
        params: {
          mesh: tag.value,
        },
      }
    }
    default: {
      return undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
}

.tag-list--align-right,
.tag-list--align-right :deep(.truncate-container) {
  justify-content: flex-end;
}

.tag {
  font-weight: $kui-font-weight-regular;
}

.tag :deep(a) {
  color: currentColor;
}
</style>
