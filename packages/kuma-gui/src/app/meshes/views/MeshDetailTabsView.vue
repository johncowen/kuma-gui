<template>
  <RouteView
    name="mesh-detail-tabs-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <template #title>
        <h1>
          <XCopyButton
            :text="route.params.mesh"
          >
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
            />
          </XCopyButton>
        </h1>
      </template>
      <template
        #actions
      >
        <MeshActionGroup
          :item="props.mesh"
          @change="() => route.replace({ name: 'mesh-list-view' })"
        >
          <template
            #control
          >
            <XAction
              action="expand"
              appearance="primary"
            >
              {{ t('meshes.action_menu.toggle_button') }}
            </XAction>
          </template>
        </MeshActionGroup>
      </template>

      <XTabs
        :selected="route.child()?.name"
        data-testid="mesh-tabs"
      >
        <template
          v-for="{ name } in route.children.filter(({ name }) => name !== 'external-service-list-view')"
          :key="name"
          #[`${name}-tab`]
        >
          <XAction
            :to="{ name }"
          >
            {{ t(`meshes.routes.item.navigation.${name}`) }}
          </XAction>
        </template>
      </XTabs>

      <RouterView
        v-slot="{ Component }"
      >
        <component
          :is="Component"
          :mesh="props.mesh"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { useMeshActionGroup } from '../'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  mesh: Mesh
}>()
const MeshActionGroup = useMeshActionGroup()
</script>
