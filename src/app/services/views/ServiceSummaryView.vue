<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-summary-view"
    :params="{
      mesh: '',
      service: ''
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="route.params.service"
            :render="true"
          />
        </h2>
      </template>
      <KCard>
        <template #body>
          {{ route.params.service }}
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>
