<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  Foermchen,
} from 'foermchen'

interface FileFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.File>
}

const props = defineProps<FileFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <q-file
    v-model="formDataRef[field.fieldName]"
    :accept="field.config.accept"
    :clearable="field.config.clearable"
    :error="!!formErrorRef[field.fieldName]"
    :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
    :max-file-size="field.config.maxFileSize"
    :suffix="field.config.suffix"
    :disable="disabled"
    :readonly="field.config.readonly"
    outlined
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>
</template>
