<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  SelectTypes,
  SelectValue,
  Foermchen,
} from 'foermchen'

interface SelectFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Select>
}

const props = defineProps<SelectFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const isOptionOrButtonGroup = computed(() => {
  return (
    props.field.config.subType === SelectTypes.Radio ||
    props.field.config.subType === SelectTypes.Button
  )
})

const modelValueSimple = computed(() => {
  const currentValue = formDataRef.value[props.field.fieldName]
  const option = props.field.config.options.value.find(
    ({ value }) => value === currentValue,
  )

  return option?.value ?? null
})

const modelValueOption = computed(() => {
  const currentValue = formDataRef.value[props.field.fieldName]
  return (
    props.field.config.options.value.find(
      ({ value }) => value === currentValue,
    ) ?? null
  )
})

function updateModelWithOption(option: SelectValue) {
  formDataRef.value[props.field.fieldName] = option.value
}

function updateModelWithOptionOrButtonGroupValue(value: string) {
  formDataRef.value[props.field.fieldName] = value
}

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <div
    v-if="field.config.subType === SelectTypes.Default"
    style="max-width: 300px"
  >
    <q-select
      :error="!!formErrorRef[field.fieldName]"
      :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
      :label="field.config?.label ?? field.fieldName"
      :model-value="modelValueOption"
      :options="field.config.options.value"
      :disable="disabled"
      :readonly="field.config.readonly"
      outlined
      @update:model-value="updateModelWithOption"
      @blur="form.validateField(field.fieldName)"
    />
  </div>

  <div v-else-if="field.config.subType === SelectTypes.Radio">
    <q-option-group
      :model-value="modelValueSimple"
      :options="field.config.options.value"
      :disable="disabled"
      :readonly="field.config.readonly"
      type="radio"
      @update:model-value="updateModelWithOptionOrButtonGroupValue"
    ></q-option-group>
  </div>

  <div v-else>
    <q-btn-toggle
      :model-value="modelValueSimple"
      toggle-color="primary"
      :options="field.config.options.value"
      :disable="disabled"
      :readonly="field.config.readonly"
      @update:model-value="updateModelWithOptionOrButtonGroupValue"
    />
  </div>

  <div
    v-if="!!formErrorRef[field.fieldName] && isOptionOrButtonGroup"
    class="text-negative"
  >
    {{ formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '' }}
  </div>
</template>
