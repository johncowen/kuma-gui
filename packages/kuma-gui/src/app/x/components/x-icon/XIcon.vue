<template>
  <component
    :is="slots.default ? XTooltip : XAnonymous"
  >
    <!-- we hardcode decorative to false for the moment due to an issue with kong/icons -->
    <component
      v-bind="attrs"
      :is="icons[props.name]"
      :aria-described-by="slots.default ? id : undefined"
      :tabindex="slots.default ? 0 : undefined"
      :decorative="false"
      :color="props.color ? props.color : `var(--${props.name}IconColor, 'currentColor')`"
      :size="props.size"
      display="inline-block"
      :class="`x-icon-icon x-icon-${props.name}-icon`"
    />

    <template #content>
      <div
        :id="id"
      >
        <slot
          v-if="slots.default"
          name="default"
        />
      </div>
    </template>
  </component>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import {
  ForwardIcon,
  GatewayIcon,
  WarningIcon,
  PortalIcon,
  MeshIcon,
  BookIcon,
  FilterIcon,
  CopyIcon,
  RuntimeKicIcon,
  DeployIcon,
  MoreIcon,
  ChevronDownIcon,
  CogIcon,
  AddCircleIcon,
  HelpIcon,
  RefreshIcon,
  ProgressIcon,
  InfoIcon,
  PlugIcon,
  VitalsIcon,
  RemoveIcon,
  KeyboardReturnIcon,
} from '@kong/icons'
import { useSlots, useAttrs, useId } from 'vue'

import XAnonymous from '@/app/x/components/x-anonymous/XAnonymous.vue'
import XTooltip from '@/app/x/components/x-tooltip/XTooltip.vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const icons = {
  standard: 'span',
  'policy-role-producer': 'span',
  'policy-role-consumer': 'span',
  'policy-role-system': 'span',
  'policy-role-workload-owner': 'span',
  inbound: ForwardIcon,
  outbound: GatewayIcon,
  builtin: PortalIcon,
  delegated: PortalIcon,
  warning: WarningIcon,
  mesh: MeshIcon,
  docs: BookIcon,
  search: FilterIcon,
  copy: CopyIcon,
  more: MoreIcon,
  expand: ChevronDownIcon,
  kubernetes: RuntimeKicIcon,
  universal: DeployIcon,
  settings: CogIcon,
  help: HelpIcon,
  create: AddCircleIcon,
  refresh: RefreshIcon,
  progress: ProgressIcon,
  info: InfoIcon,
  connected: PlugIcon,
  healthy: VitalsIcon,
  unhealthy: RemoveIcon,
  submit: KeyboardReturnIcon,
} as const
const id = `-x-icon-tooltip-${useId()}`
const slots = useSlots()

const props = withDefaults(defineProps<{
  name: keyof typeof icons // @TODO(jc) :variant
  color?: string
  size?: string
}>(), {
  placement: 'auto',
  color: undefined,
  size: KUI_ICON_SIZE_30,
})
</script>
<style lang="scss" scoped>
.x-icon-mesh-icon {
  --meshIconColor: #{$kui-color-text-decorative-aqua};
}
.x-icon-icon {
  --warningIconColor: #ffa600;
}
.x-icon-standard-icon {
  --icon-before: url('@/assets/images/east-west.svg');
  &::before {
    position: relative;
    top: 3px;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    content: '';
    background-color: var(--icon-before-color, currentColor);
    display: inline-flex;

    mask-image: var(--icon-before);
    -webkit-mask-image: var(--icon-before);
    mask-size: 100%;
    -webkit-mask-size: 100%;
    width: v-bind('props.size');
    height: v-bind('props.size');
  }
}
.x-icon-policy-role-producer-icon,
.x-icon-policy-role-consumer-icon,
.x-icon-policy-role-workload-owner-icon,
.x-icon-policy-role-system-icon {
  &::before {
    color: var(--icon-before-color, currentColor);
    display: inline-flex;

    width: v-bind('props.size');
    height: v-bind('props.size');
  }
  &.x-icon-policy-role-producer-icon {
    &::before {
      content: 'P';
    }
  }
  &.x-icon-policy-role-consumer-icon {
    &::before {
      content: 'C';
    }
  }
  &.x-icon-policy-role-system-icon {
    &::before {
      content: 'S';
    }
  }
  &.x-icon-policy-role-workload-owner-icon {
    &::before {
      content: 'W';
    }
  }
}

</style>
<style lang="scss">
[id^='-x-icon-tooltip'] ul {
  padding-left: $kui-space-60;
}
[id^='-x-icon-tooltip'] ul li:first-child:last-child {
  margin-left: calc(0px - $kui-space-60);
  list-style-type: none;
}
</style>
