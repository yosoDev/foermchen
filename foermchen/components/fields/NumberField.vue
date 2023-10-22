<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  Foermchen,
  NumberTypes,
} from 'foermchen'

interface NumberFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Number>
}

const props = defineProps<NumberFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <q-input
    v-if="field.config.subType === NumberTypes.Default"
    v-model.number="formDataRef[field.fieldName]"
    :label="field.config?.label ?? field.fieldName"
    :name="field.fieldName"
    type="number"
    :error="!!formErrorRef[field.fieldName]"
    :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
    :min="field.config.min"
    :max="field.config.max"
    :step="field.config.step"
    :suffix="field.config.suffix"
    :disable="disabled"
    :readonly="field.config.readonly"
    outlined
    @blur="form.validateField(field.fieldName)"
  />

  <template v-else>
    <span>{{ field.config?.label ?? field.fieldName }}</span>

    <q-slider
      v-model.number="formDataRef[field.fieldName]"
      :name="field.fieldName"
      :min="field.config.min"
      :max="field.config.max"
      :step="field.config.step"
      :disable="disabled"
      :readonly="field.config.readonly"
      label
      :label-value="`${formDataRef[field.fieldName]} ${field.config.suffix}`"
      @change="form.validateField(field.fieldName)"
    />

    <div v-if="!!formErrorRef[field.fieldName]" class="text-negative">
      {{ formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '' }}
    </div>
  </template>
</template>
