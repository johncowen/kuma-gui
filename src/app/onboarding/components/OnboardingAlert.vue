<template>
  <KAlert
    v-if="isShowingOnboardingAlert"
    appearance="success"
    dismissible
    data-testid="onboarding-notification"
    @dismiss="closeAlert"
  >
    <div class="onboarding-alert-content">
      <div
        v-html="t('main-overview.detail.onboarding.message', { name: t('common.product.name') })"
      />

      <KButton
        appearance="primary"
        size="small"
        class="action-button"
        :to="{ name: 'onboarding-welcome-view' }"
      >
        {{ t('main-overview.detail.onboarding.get_started_link') }}
      </KButton>
    </div>
  </KAlert>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useI18n } from '@/utilities'
import { ClientStorage } from '@/utilities/ClientStorage'

const { t } = useI18n()

const isShowingOnboardingAlert = ref(ClientStorage.get('hasDismissedOnboardingAlert') !== 'true')

function closeAlert() {
  isShowingOnboardingAlert.value = false
  ClientStorage.set('hasDismissedOnboardingAlert', 'true')
}
</script>

<style lang="scss" scoped>
.onboarding-alert-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $kui-space-60;
}
</style>
