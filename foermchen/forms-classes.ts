import { plainToClass } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'
import { computed, Ref, toRef } from 'vue'

import {
  getFieldMetaDataStorage,
  getFormMetaDataStorage,
  FieldTypeDefaultValues,
  FieldTypes,
  FormDataRef,
  FormErrorRef,
  FormFieldConfig,
  FormDecoratorConfig,
} from 'foermchen'

export abstract class AbstractForm {}

export class Foermchen<F extends AbstractForm> {
  private readonly formMetaDataStorage = getFormMetaDataStorage()
  private readonly fieldMetaDataStorage = getFieldMetaDataStorage()

  private readonly data: FormDataRef
  private readonly errors: FormErrorRef
  private readonly valid: Ref<boolean>

  constructor(private readonly FormConstructor: new () => F) {
    if (this.getFormMetaData() === null) {
      throw new Error(
        `"${FormConstructor.name}" must use the "@Form" decorator`,
      )
    }

    if (this.getFieldMetaData() === null) {
      throw new Error(`"${FormConstructor.name}" has no registered fields`)
    }

    this.data = toRef(this.getDataObject())
    this.errors = toRef(this.getErrorObject())

    this.valid = computed(
      () =>
        !Object.values(this.errors.value).some(
          (value) => typeof value === 'string',
        ),
    )
  }

  private getFormMetaData() {
    return this.formMetaDataStorage.getMetaDataForTarget(this.FormConstructor)
  }

  private getFieldMetaData() {
    return this.fieldMetaDataStorage.getMetaDataForTarget(this.FormConstructor)
  }

  private getDataObject() {
    const fields = this.getFields()

    const fieldsMapping = fields
      .filter(({ type }) => type !== FieldTypes.Info)
      .map(({ fieldName, type }) => [fieldName, type]) as [string, FieldTypes][]

    return fieldsMapping.reduce<{ [key: string]: any }>(
      (data, [fieldName, type]) => {
        const fieldConfig = fields.find(
          ({ fieldName: _fieldName }) => _fieldName === fieldName,
        ).config as any
        data[fieldName] = fieldConfig?.default ?? FieldTypeDefaultValues[type]

        return data
      },
      {},
    )
  }

  private getErrorObject() {
    const fields = this.getFields()
      .filter(({ type }) => type !== FieldTypes.Info)
      .map(({ fieldName }) => fieldName)

    return fields.reduce<{ [key: string]: string | false }>(
      (data, fieldName) => {
        data[fieldName] = false

        return data
      },
      {},
    )
  }

  public getFields(): FormFieldConfig<any>[] {
    return this.getFieldMetaData().map(({ fieldName, type, config }) => ({
      fieldName,
      type,
      config,
    }))
  }

  public getDataRef() {
    return this.data
  }

  public getErrorRef() {
    return this.errors
  }

  public getValidRef() {
    return this.valid
  }

  public validateAndReturnErrors(): ValidationError[] {
    const data = this.data.value
    const form = plainToClass(this.FormConstructor, data)

    return validateSync(form)
  }

  public validate(): boolean {
    const errors = this.validateAndReturnErrors()

    this.handleErrors(errors)

    return errors.length < 1
  }

  public validateField(field: string): boolean {
    if (!(field in this.data.value)) {
      return false
    }

    // reset errors
    this.errors.value[field] = false

    const errors = this.validateAndReturnErrors()

    const fieldErrors = errors.find(({ property }) => property === field)

    if (!fieldErrors) {
      return true
    }

    const fieldErrorStrings = Object.values(fieldErrors.constraints)

    if (fieldErrorStrings.length < 1) {
      return true
    }

    this.errors.value[field] = fieldErrorStrings.join('<br>')

    return false
  }

  private handleErrors(errors: ValidationError[]) {
    for (const field in this.errors.value) {
      const error = errors.find(({ property }) => property === field)

      if (error) {
        const errorString = Object.values(error.constraints).join('<br>')

        if (errorString.length > 0) {
          this.errors.value[field] = errorString

          continue
        }
      }

      this.errors.value[field] = false
    }
  }

  public getFormLayout(): FormDecoratorConfig<any> {
    return {
      layout: this.getFormMetaData().layout,
      layoutConfig: this.getFormMetaData().layoutConfig,
    }
  }
}
