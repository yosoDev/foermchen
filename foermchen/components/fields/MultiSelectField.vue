<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  MultiSelectTypes,
  SelectValue,
  Foermchen,
} from 'foermchen'

interface MultiSelectFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.MultiSelect>
}

const props = defineProps<MultiSelectFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const optionGroupType = computed(() => {
  if (props.field.config.subType === MultiSelectTypes.Checkbox) {
    return 'checkbox'
  }

  if (props.field.config.subType === MultiSelectTypes.Toggle) {
    return 'toggle'
  }

  return undefined
})

const isOptionGroup = computed(() => {
  return (
    props.field.config.subType === MultiSelectTypes.Checkbox ||
    props.field.config.subType === MultiSelectTypes.Toggle
  )
})

const modelValueSimple = computed(() => {
  return formDataRef.value[props.field.fieldName] as string[]
})

const modelValueOption = computed(() => {
  const currentValue = formDataRef.value[props.field.fieldName] as string[]
  return props.field.config.options.value.filter(({ value }) =>
    currentValue.includes(value),
  )
})

function updateModelWithOptions(options: SelectValue[]) {
  formDataRef.value[props.field.fieldName] = options.map(({ value }) => value)
}

function updateModelWithOptionGroupValue(values: string[]) {
  formDataRef.value[props.field.fieldName] = values
}

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <div
    v-if="field.config.subType === MultiSelectTypes.Default"
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
      multiple
      outlined
      @update:model-value="updateModelWithOptions"
      @blur="form.validateField(field.fieldName)"
    />
  </div>

  <div v-else>
    <q-option-group
      :model-value="modelValueSimple"
      :options="field.config.options.value"
      :type="optionGroupType"
      :disable="disabled"
      :readonly="field.config.readonly"
      @update:model-value="updateModelWithOptionGroupValue"
    ></q-option-group>
  </div>

  <div
    v-if="!!formErrorRef[field.fieldName] && isOptionGroup"
    class="text-negative"
  >
    {{ formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '' }}
  </div>
</template>
