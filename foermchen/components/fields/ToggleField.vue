<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  ToggleTypes,
  Foermchen,
} from 'foermchen'

interface NumberFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Toggle>
}

const props = defineProps<NumberFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <div>
    <q-toggle
      v-if="field.config.subType === ToggleTypes.Default"
      v-model="formDataRef[field.fieldName]"
      :label="field.config?.label ?? field.fieldName"
      :disable="disabled"
      :readonly="field.config.readonly"
      @change="form.validateField(field.fieldName)"
    ></q-toggle>

    <q-checkbox
      v-else
      v-model="formDataRef[field.fieldName]"
      :label="field.config?.label ?? field.fieldName"
      :disable="disabled"
      :readonly="field.config.readonly"
      @change="form.validateField(field.fieldName)"
    ></q-checkbox>
  </div>

  <div v-if="!!formErrorRef[field.fieldName]" class="text-negative">
    {{ formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '' }}
  </div>
</template>
