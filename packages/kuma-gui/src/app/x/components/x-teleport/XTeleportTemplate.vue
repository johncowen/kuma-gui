<template>
  <Teleport
    v-if="ready"
    :to="`[data-x-teleport-id='${props.to.name}']`"
  >
    <slot name="default" />
  </Teleport>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
const props = defineProps<{
  to: {
    name: string
  }
}>()
const controller = new AbortController()
const ready = ref<boolean>(false)
onMounted(() => {
  if (document.querySelector(`[data-x-teleport-id='${props.to.name}']`) !== null) {
    ready.value = true
  } else {
    window.addEventListener('x-teleport-slot:mounted', (e: CustomEvent<{ name: string }> | Event) => {
      if ('detail' in e && e.detail?.name === props.to.name) {
        ready.value = true
      }
    }, { signal: controller.signal })
  }
})

onBeforeUnmount(() => {
  controller.abort()
})
</script>
