import { toRef, unref } from 'vue'

import {
  AbstractForm,
  getFieldMetaDataStorage,
  getFormMetaDataStorage,
  FieldTypes,
  FormDecoratorConfig,
  FormLayout,
  MultiSelectTypes,
  NumberTypes,
  SelectTypes,
  TextTypes,
  ToggleTypes,
  UserFieldConfig,
  getTranslator,
  CommonFieldConfig,
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
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import { IsDateString, IsTimeString } from 'foermchen/contraints'

function defaultTranslator(
  key: string,
  label: string,
  params: { [key: string]: string | number } = {},
): (validationArguments: ValidationArguments) => string {
  const translate = getTranslator()

  return (args: ValidationArguments) =>
    translate(key, {
      label,
      value: args.value,
      ...params,
    })
}

function defaultValidationOptions<FC extends CommonFieldConfig<any>>(
  translationKey: string,
  config: FC,
  propertyName: string,
  params: { [key: string]: string | number } = {},
  isArray = false,
): ValidationOptions {
  return {
    message: defaultTranslator(
      translationKey,
      config.label ?? propertyName,
      params,
    ),
    each: isArray,
  }
}

function typeValidationOptions<FC extends CommonFieldConfig<any>>(
  type: 'string' | 'number' | 'boolean',
  config: FC,
  propertyName: string,
  isArray = false,
): ValidationOptions {
  return defaultValidationOptions(
    `foermchen.errors.types.${type}`,
    config,
    propertyName,
    {},
    isArray,
  )
}

function registerStringValidator<FC extends CommonFieldConfig<any>>(
  target: object,
  propertyName: string,
  config: FC,
  isArray = false,
) {
  IsString(typeValidationOptions('string', config, propertyName, isArray))(
    target,
    propertyName,
  )
}

function registerNumberValidator<FC extends CommonFieldConfig<any>>(
  target: object,
  propertyName: string,
  config: FC,
  isArray = false,
) {
  IsNumber(
    undefined,
    typeValidationOptions('number', config, propertyName, isArray),
  )(target, propertyName)
}

function registerNotEmptyValidator<FC extends CommonFieldConfig<any>>(
  target: object,
  propertyName: string,
  config: FC,
  isArray = false,
) {
  IsNotEmpty(
    defaultValidationOptions(
      'foermchen.errors.generic.notEmpty',
      config,
      propertyName,
      {},
      isArray,
    ),
  )(target, propertyName)
}

export function TextField(config: UserFieldConfig<FieldTypes.Text>) {
  return function (target: object, propertyName: string) {
    if (config.defaultConstraints !== false) {
      registerStringValidator(target, propertyName, config)
    }

    if (config.required) {
      registerNotEmptyValidator(target, propertyName, config)
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
      registerNumberValidator(target, propertyName, config)

      if (typeof config.min === 'number') {
        Min(
          config.min,
          defaultValidationOptions(
            'foermchen.errors.numbers.min',
            config,
            propertyName,
            { min: config.min },
          ),
        )(target, propertyName)
      }

      if (typeof config.max === 'number') {
        Max(
          config.max,
          defaultValidationOptions(
            'foermchen.errors.numbers.max',
            config,
            propertyName,
            { min: config.max },
          ),
        )(target, propertyName)
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
      IsBoolean(typeValidationOptions('boolean', config, propertyName))(
        target,
        propertyName,
      )
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
      registerStringValidator(target, propertyName, config)

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
      registerStringValidator(target, propertyName, config)

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
      registerStringValidator(target, propertyName, config)
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
      registerStringValidator(target, propertyName, config)

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
      registerStringValidator(target, propertyName, config)

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
      registerStringValidator(target, propertyName, config, true)

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

export function Form<FL extends FormLayout>(config: FormDecoratorConfig<FL>) {
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
