import {
  AbstractForm,
  FieldMetaData,
  FieldTypes,
  FormLayout,
  FormMetaData,
} from 'foermchen'

export class FormMetaDataStorage {
  private readonly forms = new Map<any, FormMetaData<any>>()

  public addMetaData<FL extends FormLayout>(formMetaData: FormMetaData<FL>) {
    this.forms.set(formMetaData.formConstructor, formMetaData)
  }

  public getMetaDataForTarget(formConstructor: new () => AbstractForm) {
    if (!this.forms.has(formConstructor)) {
      return null
    }

    return this.forms.get(formConstructor)
  }
}

export class FieldMetaDataStorage {
  private readonly fields = new Map<any, FieldMetaData<any>[]>()

  public addMetaData<FT extends FieldTypes>(fieldMetaData: FieldMetaData<FT>) {
    if (!this.fields.has(fieldMetaData.formConstructor)) {
      this.fields.set(fieldMetaData.formConstructor, [])
    }

    this.fields.get(fieldMetaData.formConstructor).push(fieldMetaData)
  }

  public getMetaDataForTarget(formConstructor: new () => AbstractForm) {
    if (!this.fields.has(formConstructor)) {
      return null
    }

    return this.fields.get(formConstructor)
  }
}

// borrowed from class-validator package
function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }

  if (typeof global !== 'undefined') {
    return global
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'window'.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'window'.
    return window
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'self'.
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'self'.
    return self
  }
}

export function getFieldMetaDataStorage(): FieldMetaDataStorage {
  const global = getGlobal()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return global.fieldMetaDataStorage
}

export function getFormMetaDataStorage(): FormMetaDataStorage {
  const global = getGlobal()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return global.formMetaDataStorage
}

export function setupMetaDataStorage() {
  const global = getGlobal()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.fieldMetaDataStorage) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.fieldMetaDataStorage = new FieldMetaDataStorage()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.formMetaDataStorage) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.formMetaDataStorage = new FormMetaDataStorage()
  }
}
