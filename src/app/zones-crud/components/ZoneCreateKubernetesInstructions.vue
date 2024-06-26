<template>
  <div>
    <h3 class="form-step-title">
      <span class="form-step-number">1</span>
      {{ t('zones-crud.form.kubernetes.prerequisites.title') }}
    </h3>

    <ul class="instruction-list">
      <li>
        <b>{{ t('zones-crud.form.kubernetes.prerequisites.step1Label') }}{{ props.zoneIngressEnabled ? ' ' + t('zones-crud.form.kubernetes.prerequisites.step1LabelAddendum') : '' }}</b>:
        {{ t('zones-crud.form.kubernetes.prerequisites.step1Description', { productName: t('common.product.name') }) }}
      </li>

      <li>
        <b>{{ t('zones-crud.form.kubernetes.prerequisites.step2Label') }}</b>:
        {{ t('zones-crud.form.kubernetes.prerequisites.step2Description') }}
      </li>

      <li>
        <a href="https://helm.sh/docs/intro/install/">{{ t('zones-crud.form.kubernetes.prerequisites.step3LinkTitle') }}</a> {{ t('zones-crud.form.kubernetes.prerequisites.step3Tail') }}
      </li>
    </ul>

    <h3 class="form-step-title">
      <span class="form-step-number">2</span>
      {{ t('zones-crud.form.kubernetes.helm.title') }}
    </h3>

    <p>On your local machine, create a namespace in your Kubernetes cluster and pull down the kong Helm repo.</p>

    <ol class="instruction-list">
      <li>
        <b>{{ t('zones-crud.form.kubernetes.helm.step1Description') }}</b>

        <CodeBlock
          class="mt-2"
          :code="t('zones-crud.form.kubernetes.helm.step1Command')"
          language="bash"
        />
      </li>

      <li>
        <b>{{ t('zones-crud.form.kubernetes.helm.step2Description') }}</b>

        <CodeBlock
          class="mt-2"
          :code="t('zones-crud.form.kubernetes.helm.step2Command')"
          language="bash"
        />
      </li>

      <li>
        <b>{{ t('zones-crud.form.kubernetes.helm.step3Description') }}</b>

        <CodeBlock
          class="mt-2"
          :code="t('zones-crud.form.kubernetes.helm.step3Command')"
          language="bash"
        />
      </li>
    </ol>

    <h3 class="form-step-title">
      <span class="form-step-number">3</span>
      {{ t('zones-crud.form.kubernetes.secret.title') }}
    </h3>

    <p>{{ t('zones-crud.form.kubernetes.secret.createSecretDescription') }}</p>

    <CodeBlock
      class="mt-4"
      :code="kubernetesCreateSecretCommand"
      language="bash"
    />

    <h3 class="form-step-title">
      <span class="form-step-number">4</span>
      {{ t('zones-crud.form.kubernetes.connectZone.title') }}
    </h3>

    <p>{{ t('zones-crud.form.kubernetes.connectZone.configDescription') }}</p>

    <span class="field-group-label mt-4">
      {{ t('zones-crud.form.kubernetes.connectZone.configFileName') }}
    </span>

    <CodeBlock
      data-testid="zone-kubernetes-config"
      :code="kubernetesConfig"
      language="yaml"
    />

    <p class="mt-4">
      {{ t('zones-crud.form.kubernetes.connectZone.connectDescription') }}
    </p>

    <CodeBlock
      class="mt-4"
      :code="t('zones-crud.form.kubernetes.connectZone.connectCommand').trim()"
      language="bash"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import {
  useI18n,
} from '@/app/application'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'

const { t } = useI18n()
const route = useRoute()

const props = defineProps({
  zoneName: {
    type: String,
    required: true,
  },

  globalKdsAddress: {
    type: String,
    required: true,
  },

  zoneIngressEnabled: {
    type: Boolean,
    required: true,
  },

  zoneEgressEnabled: {
    type: Boolean,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  base64EncodedToken: {
    type: String,
    required: true,
  },
})

const kubernetesCreateSecretCommand = computed(() => t('zones-crud.form.kubernetes.secret.createSecretCommand', {
  token: props.base64EncodedToken,
}).trim())

const kubernetesConfig = computed(() => {
  const placeholders: Record<string, string> = {
    zoneName: props.zoneName,
    globalKdsAddress: props.globalKdsAddress,
    zoneIngressEnabled: String(props.zoneIngressEnabled),
    zoneEgressEnabled: String(props.zoneEgressEnabled),
    controlPlaneId: typeof route.params.virtualControlPlaneId === 'string' ? route.params.virtualControlPlaneId : '',
  }

  return t('zones-crud.form.kubernetes.connectZone.config', placeholders).trim()
})

</script>
