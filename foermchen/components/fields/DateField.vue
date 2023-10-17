<script setup lang="ts" generic="F extends AbstractForm">
import { computed } from 'vue'

import {
  AbstractForm,
  FieldTypes,
  FormFieldConfig,
  isFieldDisabled,
  Foermchen,
} from 'foermchen'

interface DateFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FieldTypes.Date>
}

const props = defineProps<DateFieldProps>()

const formDataRef = props.form.getDataRef()
const formErrorRef = props.form.getErrorRef()

const disabled = computed(() =>
  isFieldDisabled(props.field.config.disabled, formDataRef),
)
</script>

<template>
  <div style="max-width: 300px">
    <q-input
      v-model="formDataRef[field.fieldName]"
      filled
      :error="!!formErrorRef[field.fieldName]"
      :error-message="(formErrorRef[field.fieldName] ? formErrorRef[field.fieldName] : '') as string"
      :disable="disabled"
      :readonly="field.config.readonly"
      outlined
      @update:model-value="form.validateField(field.fieldName)"
      @blur="form.validateField(field.fieldName)"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="formDataRef[field.fieldName]"
              :title="field.config.title"
              :subtitle="field.config.subtitle"
              :today-btn="field.config.todayBtn"
              :disable="disabled"
              :readonly="field.config.readonly"
              mask="YYYY-MM-DD"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
