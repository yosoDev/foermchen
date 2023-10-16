<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Förmchen</q-toolbar-title>

        <div>Förmchen {{ foermchenVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { version } from '../../package.json'

const foermchenVersion = `v${version}`
</script>
