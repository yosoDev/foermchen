<script setup lang="ts" generic="F extends AbstractForm">
import { marked } from 'marked'
import { computed } from 'vue'

import {
  AbstractForm,
  ColumnLayoutConfig,
  FormFieldConfig,
  FormLayout,
  GroupLayoutConfig,
  RowLayoutConfig,
  Foermchen,
} from 'foermchen'
import { FormField } from 'foermchen/components'

interface FoermchenRendererProps {
  form: Foermchen<F>
}

const props = defineProps<FoermchenRendererProps>()

const formFields = props.form.getFields()
const formLayout = props.form.getFormLayout()

const columnLayoutFields = computed(() => {
  const firstFieldNames = formLayout.layoutConfig as ColumnLayoutConfig

  const fields: FormFieldConfig<any>[] = []

  firstFieldNames.forEach((name) => {
    const field = formFields.find(({ fieldName }) => fieldName === name)
    if (field) {
      fields.push(field)
    }
  })

  fields.push(
    ...formFields.filter(
      ({ fieldName }) => !firstFieldNames.includes(fieldName),
    ),
  )

  return fields
})

const rowsLayoutFields = computed(() => {
  const rows = formLayout.layoutConfig as RowLayoutConfig

  const fields: FormFieldConfig<any>[][] = []
  const addedFields: string[] = []

  for (const row of rows) {
    const rowFields: FormFieldConfig<any>[] = []

    for (const name of row) {
      const field = formFields.find(({ fieldName }) => fieldName === name)

      if (field) {
        rowFields.push(field)
      }

      addedFields.push(name)
    }

    fields.push(rowFields)
  }

  fields.push(
    ...formFields
      .filter(({ fieldName }) => !addedFields.includes(fieldName))
      .map((field) => [field]),
  )

  return fields
})

const groupLayoutFields = computed(() => {
  const groups = formLayout.layoutConfig as GroupLayoutConfig

  const fields: {
    id: string
    fields: FormFieldConfig<any>[][]
    title?: string
    text?: string
  }[] = []
  const addedFields: string[] = []

  for (const group in groups) {
    const groupFields: FormFieldConfig<any>[][] = []

    const { fields: fieldNames, title, text } = groups[group]

    for (const row of fieldNames) {
      const rowFields: FormFieldConfig<any>[] = []

      for (const name of row) {
        const field = formFields.find(({ fieldName }) => fieldName === name)

        if (field) {
          rowFields.push(field)
        }

        addedFields.push(name)
      }

      groupFields.push(rowFields)
    }

    fields.push({ id: group, fields: groupFields, title, text })
  }

  const remainingFields = formFields
    .filter(({ fieldName }) => !addedFields.includes(fieldName))
    .map((field) => [field])

  if (remainingFields.length > 0) {
    fields.push({
      id: '$default',
      fields: remainingFields,
    })
  }

  return fields
})

function parseMarkdown(text: string) {
  return marked(text)
}

function validate() {
  const valid = props.form.validate()
  console.log('valid', valid)
}
</script>

<template>
  <template v-if="formLayout.layout === FormLayout.Column">
    <q-form>
      <FormField
        v-for="field in columnLayoutFields"
        :key="field.fieldName"
        :form="form"
        :field="field"
      >
      </FormField>

      <q-btn @click="validate">Submit</q-btn>
    </q-form>
  </template>

  <template v-else-if="formLayout.layout === FormLayout.Rows">
    <q-form>
      <div
        v-for="(row, i) in rowsLayoutFields"
        :key="i"
        class="row q-col-gutter-md"
      >
        <div v-for="field in row" :key="field.fieldName" class="col-12 col-md">
          <FormField :form="form" :field="field"> </FormField>
        </div>
      </div>

      <q-btn @click="validate">Submit</q-btn>
    </q-form>
  </template>

  <template v-else>
    <q-form>
      <div v-for="group in groupLayoutFields" :key="group.id">
        <span v-if="group.title" class="text-h5">{{ group.title }}</span>
        <div v-if="group.text" v-html="parseMarkdown(group.text)"></div>

        <div
          v-for="(row, i) in group.fields"
          :key="`${group.id}-${i}`"
          class="row q-col-gutter-md"
        >
          <div
            v-for="field in row"
            :key="field.fieldName"
            class="col-12 col-md"
          >
            <FormField :form="form" :field="field"> </FormField>
          </div>
        </div>
      </div>

      <q-btn @click="validate">Submit</q-btn>
    </q-form>
  </template>
</template>
