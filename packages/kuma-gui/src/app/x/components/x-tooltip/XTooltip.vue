<template>
  <KTooltip
    max-width="400"
  >
    <template
      #content
    >
      <slot name="content" />
    </template>
    <template
      #default
    >
      <slot
        v-if="slots.default"
        name="default"
      />
      <!-- required to overwrite the default slot of KTooltip which is a button -->
      <XAnonymous
        v-else
      />
    </template>
  </KTooltip>
</template>
<script lang="ts" setup>
import { KTooltip } from '@kong/kongponents'

const slots = defineSlots()
</script>

