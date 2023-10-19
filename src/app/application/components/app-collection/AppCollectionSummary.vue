<template>
  <KSlideout
    close-button-alignment="end"
    :has-overlay="false"
    is-visible
    data-testid="app-collection-summary"
    class="app-collection-summary"
    @close="emit('close')"
  >
    <slot />
  </KSlideout>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.app-collection-summary :is(.app-view-title-bar) {
  & {
    display: flex;
    align-items: center;
    gap: 6px
  }
  &::before {
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    content: '';
    display: inline-flex;
    background-color: currentColor;
  }
  &::before {
    mask-image: url('@/assets/images/icon-wifi-tethering.svg');
    -webkit-mask-image: url('@/assets/images/icon-wifi-tethering.svg');
    width: 16px;
    height: 16px;
  }
}
.app-collection-summary :is(.kong-card) {
  padding-top: 12px;
  // Overrides KSlideout’s override.
  --KCardPaddingX: #{$kui-space-80};
  --KCardPaddingY: #{$kui-space-80};
}
.app-collection-summary :is(.kong-card) :is(.kong-card) {
  --KCardPaddingX: 0;
  --KCardPaddingY: 0;
  border: none;
  padding-top: 0px;
}
.app-collection-summary :is(.panel),
.app-collection-summary :is(.panel-background),
.app-collection-summary :is(.panel-background-transparent) {
  // Overrides KSlideout’s top offset. `props.offsetTop` doesn’t accept plain CSS values.
  top: var(--AppHeaderHeight);
}
</style>
