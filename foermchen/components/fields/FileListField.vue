<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  Foermchen,
} from 'foermchen'

interface FileListFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.FileList>
}

const props = defineProps<FileListFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

function getCounterLabel({
  totalSize,
  filesNumber,
  maxFiles,
}: {
  totalSize: string
  filesNumber: number
  maxFiles: string | number
}) {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
}

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <q-file
    v-model="formDataRef[field.fieldName]"
    :accept="field.config.accept"
    :clearable="field.config.clearable"
    :counter-label="getCounterLabel"
    :error="!!formErrorRef[field.fieldName]"
    :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
    :max-files="field.config.max"
    :max-file-size="field.config.maxFileSize"
    :suffix="field.config.suffix"
    :disable="disabled"
    :readonly="field.config.readonly"
    counter
    multiple
    outlined
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>
</template>
