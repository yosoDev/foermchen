<template>
  <q-page class="q-pa-lg">
    <foermchen-renderer :form="demoForm" />

    {{ demoForm.getDataRef() }}

    <br />
    <br />

    Valid: {{ demoForm.getValidRef() }}
  </q-page>
</template>

<script setup lang="ts">
import { Foermchen } from 'foermchen'
import { FoermchenRenderer } from 'foermchen/components'
import { DemoForm } from '../forms/Demo.form'

const demoForm = new Foermchen(DemoForm)
</script>
