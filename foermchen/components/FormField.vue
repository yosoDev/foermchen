<script setup lang="ts" generic="F extends AbstractForm, FT extends FieldTypes">
import { Component as AbstractComponent } from 'vue'

import { AbstractForm, FieldTypes, FormFieldConfig, Foermchen } from 'foermchen'
import {
  ColorField,
  DateField,
  DateTimeField,
  FileField,
  FileListField,
  InfoField,
  MultiSelectField,
  NumberField,
  SelectField,
  TextField,
  TimeField,
  ToggleField,
} from 'foermchen/components'

interface FormFieldProps {
  form: Foermchen<F>
  field: FormFieldConfig<FT>
}

defineProps<FormFieldProps>()

const fieldComponents: Partial<{ [key in FieldTypes]: AbstractComponent }> = {
  [FieldTypes.Text]: TextField,
  [FieldTypes.Number]: NumberField,
  [FieldTypes.Toggle]: ToggleField,
  [FieldTypes.Select]: SelectField,
  [FieldTypes.MultiSelect]: MultiSelectField,
  [FieldTypes.Date]: DateField,
  [FieldTypes.Time]: TimeField,
  [FieldTypes.DateTime]: DateTimeField,
  [FieldTypes.Color]: ColorField,
  [FieldTypes.File]: FileField,
  [FieldTypes.FileList]: FileListField,
  [FieldTypes.Info]: InfoField,
}
</script>

<template>
  <component
    :is="fieldComponents[field.type] as any"
    v-if="field.type in fieldComponents"
    :form="form"
    :field="field"
  ></component>
</template>
