<script setup lang="ts" generic="F extends AbstractForm">
import { QInputProps } from 'quasar'
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  TextTypes,
  Foermchen,
} from 'foermchen'
import { FieldHint } from 'foermchen/components'

interface TextFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Text>
}

const props = defineProps<TextFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

function getTextFieldType(type: TextTypes): QInputProps['type'] {
  const typeMapping: { [key in TextTypes]: QInputProps['type'] } = {
    [TextTypes.Default]: 'text',
    [TextTypes.Email]: 'email',
    [TextTypes.Password]: 'password',
    [TextTypes.Phone]: 'tel',
    [TextTypes.URL]: 'url',
    [TextTypes.Textarea]: 'textarea',
  }

  return typeMapping[type]
}

function updateModel(value: string | number | null) {
  formDataRef.value[props.field.fieldName] = value ?? ''
}

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <q-input
    :clearable="field.config.clearable"
    :model-value="formDataRef[field.fieldName]"
    :label="field.config?.label ?? field.fieldName"
    :name="field.fieldName"
    :type="getTextFieldType(field.config.subType)"
    :error="!!formErrorRef[field.fieldName]"
    :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
    :suffix="field.config.suffix"
    :disable="disabled"
    :readonly="field.config.readonly"
    outlined
    @blur="form.validateField(field.fieldName)"
    @update:model-value="updateModel"
  >
    <template v-if="field.config.hint" #hint>
      <FieldHint :hint="field.config.hint"></FieldHint>
    </template>
  </q-input>
</template>
