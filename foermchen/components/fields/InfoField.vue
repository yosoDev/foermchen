<script setup lang="ts" generic="F extends AbstractForm">
import { marked } from 'marked'

import { AbstractForm, FieldTypes, FormFieldConfig, Foermchen } from 'foermchen'

interface InfoFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Info>
}

defineProps<InfoFieldProps>()

function parseMarkdown(text: string) {
  return marked(text)
}
</script>

<template>
  <div v-html="parseMarkdown(field.config.text)"></div>
</template>
