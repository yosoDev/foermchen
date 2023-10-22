<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  Foermchen,
} from 'foermchen'

interface ColorFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Color>
}

const props = defineProps<ColorFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <div style="max-width: 300px">
    <q-input
      v-if="field.config.useInput"
      v-model="formDataRef[field.fieldName]"
      :error="!!formErrorRef[field.fieldName]"
      :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
      :disable="disabled"
      :readonly="field.config.readonly"
      class="my-input"
      filled
      @update:model-value="form.validateField(field.fieldName)"
      @blur="form.validateField(field.fieldName)"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color
              v-model="formDataRef[field.fieldName]"
              format-model="hex"
              :disable="disabled"
              :readonly="field.config.readonly"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-color
      v-else
      v-model="formDataRef[field.fieldName]"
      :disable="disabled"
      :readonly="field.config.readonly"
    />
  </div>
</template>
