<template>
  <div
    class="route-view"
  >
    <div
      v-if="!hasParent"
      class="route-view-title sr-only"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ t('components.route-view.route-announcer', {title: title}) }}
    </div>
    <slot
      name="default"
      :route="{
        params: Object.fromEntries(Object.entries(route.params).map(([prop, value]) => {
          return [
            prop,
            urlParam(value)
          ]
        }))
      }"
      :children="children"
    />
  </div>
</template>
<script lang="ts" setup>
import { provide, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from '@/utilities'
export interface RouteView {
  addTitle: (title: string, sym: Symbol) => void
  removeTitle: (sym: Symbol) => void
}
export interface ImmediateParent {
  addChild: (str: string, sym: Symbol) => void
}

const { t } = useI18n()

const props = defineProps({
  module: {
    type: String,
    required: false,
    default: '',
  },
})

const title = ref<string>('')
const children = ref<string[]>([])

// we use a raf to avoid a flickering title
// this can also be achieved by using onMount in AppTitle
// but we want to keep a consistent watch/immediate api
const beforePaint = function (fn: (...args: any[]) => void) {
  let num: number
  return (...args: unknown[]) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}
const setTitle = beforePaint((title) => {
  document.title = title
})

const map = new Map<Symbol, string>()
const routeView: RouteView = {
  addTitle: (item: string, sym: Symbol) => {
    title.value = item
    map.set(sym, item)
    setTitle([...map.values()].reverse().concat(t('components.route-view.title', { name: t('common.product.name') })).join(' | '))
  },
  removeTitle: (sym: Symbol) => {
    map.delete(sym)
    setTitle([...map.values()].reverse().concat(t('components.route-view.title', { name: t('common.product.name') })).join(' | '))
  },
}

const hasParent: RouteView | undefined = inject('route-view-parent', undefined)
if (!hasParent) {
  // use the default title if we are the topmost RouteView
  setTitle(t('components.route-view.title', { name: t('common.product.name') }))
  provide('route-view-parent', routeView)
}

const iParent = inject<ImmediateParent | undefined>('route-view-immediate-parent', undefined)

const immediateParent: ImmediateParent = {
  addChild: (module, sym) => {
    children.value.push(module)
    if (typeof iParent !== 'undefined') {
      iParent.addChild(module, sym)
    }
  },

}
provide('route-view-immediate-parent', immediateParent)
const sym = Symbol('route-view')

watch(() => props.module, (module = '') => {
  if (
    typeof iParent !== 'undefined' &&
    module.length > 0
  ) {
    iParent.addChild(module, sym)
  }
}, { immediate: true })

const route = useRoute()
const urlParam = function <T extends string | null> (param: T | T[]): string {
  return (Array.isArray(param) ? param[0] : param) ?? ''
}
</script>