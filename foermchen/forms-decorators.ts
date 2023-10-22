import { toRef, unref } from 'vue'

import {
  AbstractForm,
  getFieldMetaDataStorage,
  getFormMetaDataStorage,
  FieldTypes,
  FormLayoutConfig,
  FormLayout,
  MultiSelectTypes,
  NumberTypes,
  SelectTypes,
  TextTypes,
  ToggleTypes,
  UserFieldConfig,
} from 'foermchen'
import {
  IsBoolean,
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { IsDateString, IsTimeString } from 'foermchen/contraints'

export function TextField(config: UserFieldConfig<FieldTypes.Text>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)
    }

    if (config.required) {
      IsNotEmpty()(target, propertyName)
    }

    const { type, clearable, ...configRest } = config

    const _config = {
      subType: type ?? TextTypes.Default,
      clearable: clearable ?? false,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData<FieldTypes.Text>({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Text,
      config: _config,
    })
  }
}

export function NumberField(config: UserFieldConfig<FieldTypes.Number>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsNumber()(target, propertyName)

      if (typeof config.min === 'number') {
        Min(config.min)(target, propertyName)
      }

      if (typeof config.max === 'number') {
        Max(config.max)(target, propertyName)
      }
    }

    const { type, ...configRest } = config

    const _config = {
      subType: type ?? NumberTypes.Default,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData<FieldTypes.Number>({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Number,
      config: _config,
    })
  }
}

export function ToggleField(config: UserFieldConfig<FieldTypes.Toggle>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsBoolean()(target, propertyName)
    }

    const { type, ...configRest } = config

    const _config = {
      subType: type ?? ToggleTypes.Default,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Toggle,
      config: _config,
    })
  }
}

export function DateField(config: UserFieldConfig<FieldTypes.Date>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)
      IsDateString({ message: '$property is not a valid date' })(
        target,
        propertyName,
      )
    }

    const { todayBtn, ...configRest } = config

    const _config = {
      todayBtn: todayBtn ?? false,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Date,
      config: _config,
    })
  }
}

export function TimeField(config: UserFieldConfig<FieldTypes.Time>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)
      IsTimeString({ message: '$property is not a valid time' })(
        target,
        propertyName,
      )
    }

    const { format24h, nowBtn, ...configRest } = config

    const _config = {
      format24h: format24h ?? true,
      nowBtn: nowBtn ?? false,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Time,
      config: _config,
    })
  }
}

export function DateTimeField(config: UserFieldConfig<FieldTypes.DateTime>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)
    }

    const { todayBtn, nowBtn, format24h, ...configRest } = config

    const _config = {
      todayBtn: todayBtn ?? false,
      nowBtn: nowBtn ?? false,
      format24h: format24h ?? true,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.DateTime,
      config: _config,
    })
  }
}

export function ColorField(config: UserFieldConfig<FieldTypes.Color>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)
      IsHexColor()(target, propertyName)
    }

    const { useInput, ...configRest } = config

    const _config = {
      useInput: useInput ?? true,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Color,
      config: _config,
    })
  }
}

export function SelectField(config: UserFieldConfig<FieldTypes.Select>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString()(target, propertyName)

      const values = unref(config.options).map(({ value }) => value)
      IsIn(values)(target, propertyName)
    }

    const { type, options, ...configRest } = config

    const _config = {
      subType: type ?? SelectTypes.Default,
      options: toRef(options),
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Select,
      config: _config,
    })
  }
}

export function MultiSelectField(
  config: UserFieldConfig<FieldTypes.MultiSelect>,
) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      IsString({ each: true })(target, propertyName)

      const values = unref(config.options).map(({ value }) => value)
      IsIn(values, { each: true })(target, propertyName)
    }

    const { type, options, ...configRest } = config

    const _config = {
      subType: type ?? MultiSelectTypes.Default,
      options: toRef(options),
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.MultiSelect,
      config: _config,
    })
  }
}

export function FileField(config: UserFieldConfig<FieldTypes.File>) {
  return function (target: object, propertyName: string) {
    const { clearable, ...configRest } = config

    const _config = {
      clearable: clearable ?? false,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.File,
      config: _config,
    })
  }
}

export function FileListField(config: UserFieldConfig<FieldTypes.FileList>) {
  return function (target: object, propertyName: string) {
    const { max, clearable, ...configRest } = config

    const _config = {
      max: max ?? 1,
      clearable: clearable ?? false,
      ...configRest,
    }

    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.FileList,
      config: _config,
    })
  }
}

export function InfoField(config: UserFieldConfig<FieldTypes.Info>) {
  return function (target: object, propertyName: string) {
    const storage = getFieldMetaDataStorage()
    storage.addMetaData({
      formConstructor: target.constructor,
      fieldName: propertyName,
      type: FieldTypes.Info,
      config,
    })
  }
}

export function Form<FL extends FormLayout>(config: FormLayoutConfig<FL>) {
  return function (target: new () => AbstractForm) {
    if (!(target.prototype instanceof AbstractForm)) {
      throw new Error(`Class "${target.name}" is not extending "AbstractForm"`)
    }

    const storage = getFormMetaDataStorage()
    storage.addMetaData({
      formConstructor: target,
      ...config,
    })
  }
}
