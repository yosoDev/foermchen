import { Ref } from 'vue'

export enum FieldTypes {
  Text = 'text',
  Number = 'number',
  Toggle = 'toggle',
  Select = 'select',
  MultiSelect = 'multiselect',
  Date = 'date',
  Time = 'time',
  DateTime = 'datetime',
  Color = 'color',
  File = 'file',
  FileList = 'filelist',
  Info = 'info',
}

export type CommonFieldConfig<FT extends FieldTypes> = {
  label?: string
  hint?: string
  default?: FieldTypeDefaults[FT]
  readonly?: boolean
  disabled?: boolean | string
  defaultConstraints?: boolean
  required?: boolean
}

export type SelectValue = { value: string; label: string }

type FieldConfig<FT extends FieldTypes> = FT extends FieldTypes.Text
  ? CommonFieldConfig<FT> & {
      subType: TextTypes
      clearable: boolean
      suffix?: string
    }
  : FT extends FieldTypes.Number
  ? CommonFieldConfig<FT> & { subType: NumberTypes; suffix?: string } & {
      min?: number
      max?: number
      step?: number
    }
  : FT extends FieldTypes.Toggle
  ? CommonFieldConfig<FT> & { subType: ToggleTypes }
  : FT extends FieldTypes.Select
  ? CommonFieldConfig<FT> & { subType: SelectTypes } & {
      options: Ref<SelectValue[]>
    }
  : FT extends FieldTypes.MultiSelect
  ? CommonFieldConfig<FT> & { subType: MultiSelectTypes } & {
      options: Ref<SelectValue[]>
    }
  : FT extends FieldTypes.Date
  ? CommonFieldConfig<FT> & {
      title?: string
      subtitle?: string
      todayBtn: boolean
    }
  : FT extends FieldTypes.DateTime
  ? CommonFieldConfig<FT> & {
      title?: string
      subtitle?: string
      todayBtn: boolean
      nowBtn: boolean
      format24h: boolean
    }
  : FT extends FieldTypes.Time
  ? CommonFieldConfig<FT> & {
      format24h: boolean
      nowBtn: boolean
    }
  : FT extends FieldTypes.File
  ? CommonFieldConfig<FT> & {
      accept?: string
      maxFileSize?: number
      clearable: boolean
      suffix?: string
    }
  : FT extends FieldTypes.FileList
  ? CommonFieldConfig<FT> & {
      max: number
      accept?: string
      maxFileSize?: number
      clearable: boolean
      suffix?: string
    }
  : FT extends FieldTypes.Color
  ? CommonFieldConfig<FT> & { useInput: boolean }
  : FT extends FieldTypes.Info
  ? { text: string }
  : CommonFieldConfig<FT>

export type UserFieldConfig<FT extends FieldTypes> = FT extends FieldTypes.Text
  ? CommonFieldConfig<FT> & {
      type?: TextTypes
      clearable?: boolean
      suffix?: string
    }
  : FT extends FieldTypes.Number
  ? CommonFieldConfig<FT> & { type?: NumberTypes; suffix?: string } & {
      min?: number
      max?: number
      step?: number
    }
  : FT extends FieldTypes.Toggle
  ? CommonFieldConfig<FT> & { type?: ToggleTypes }
  : FT extends FieldTypes.Select
  ? CommonFieldConfig<FT> & { type?: SelectTypes } & {
      options: SelectValue[] | Ref<SelectValue[]>
    }
  : FT extends FieldTypes.MultiSelect
  ? CommonFieldConfig<FT> & { type?: MultiSelectTypes } & {
      options: SelectValue[] | Ref<SelectValue[]>
    }
  : FT extends FieldTypes.Date
  ? CommonFieldConfig<FT> & {
      title?: string
      subtitle?: string
      todayBtn?: boolean
    }
  : FT extends FieldTypes.DateTime
  ? CommonFieldConfig<FT> & {
      title?: string
      subtitle?: string
      todayBtn?: boolean
      nowBtn?: boolean
      format24h?: boolean
    }
  : FT extends FieldTypes.Time
  ? CommonFieldConfig<FT> & {
      format24h?: boolean
      nowBtn?: boolean
    }
  : FT extends FieldTypes.File
  ? CommonFieldConfig<FT> & {
      accept?: string
      maxFileSize?: number
      clearable?: boolean
      suffix?: string
    }
  : FT extends FieldTypes.FileList
  ? CommonFieldConfig<FT> & {
      max?: number
      accept?: string
      maxFileSize?: number
      clearable?: boolean
      suffix?: string
    }
  : FT extends FieldTypes.Color
  ? CommonFieldConfig<FT> & { useInput?: boolean }
  : FT extends FieldTypes.Info
  ? { text: string }
  : CommonFieldConfig<FT>

export enum TextTypes {
  Default = 'default',
  Email = 'email',
  Password = 'password',
  Phone = 'phone',
  URL = 'url',
  Textarea = 'textarea',
}

export enum NumberTypes {
  Default = 'default',
  Slider = 'slider',
}

export enum ToggleTypes {
  Default = 'default',
  Checkbox = 'checkbox',
}

export enum SelectTypes {
  Default = 'default',
  Radio = 'radio',
  Button = 'button',
}

export enum MultiSelectTypes {
  Default = 'default',
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

export type FormFieldConfig<FT extends FieldTypes> = Omit<
  FieldMetaData<FT>,
  'formConstructor'
>

export type FieldTypeDefaults = {
  [FieldTypes.Text]: string
  [FieldTypes.Number]: number
  [FieldTypes.Toggle]: boolean
  [FieldTypes.Select]: string
  [FieldTypes.MultiSelect]: string[]
  [FieldTypes.Date]: string
  [FieldTypes.Time]: string
  [FieldTypes.DateTime]: string
  [FieldTypes.Color]: string
  [FieldTypes.File]: null
  [FieldTypes.FileList]: null
  [FieldTypes.Info]: string
}

export const FieldTypeDefaultValues: FieldTypeDefaults = {
  [FieldTypes.Text]: '',
  [FieldTypes.Number]: 0,
  [FieldTypes.Toggle]: false,
  [FieldTypes.Select]: '',
  [FieldTypes.MultiSelect]: [],
  [FieldTypes.Date]: '',
  [FieldTypes.Time]: '',
  [FieldTypes.DateTime]: '',
  [FieldTypes.Color]: '',
  [FieldTypes.File]: null,
  [FieldTypes.FileList]: null,
  [FieldTypes.Info]: '',
}

export type FormDataRef = Ref<{ [key: string]: any }>
export type FormErrorRef = Ref<{ [key: string]: string | false }>

export enum FormLayout {
  Column = 'column',
  Rows = 'rows',
  Groups = 'groups',
}

export type ColumnLayoutConfig = string[]
export type RowLayoutConfig = string[][]
export type FormGroup = {
  title?: string
  text?: string
  fields: RowLayoutConfig
}
export type GroupLayoutConfig = { [key: string]: FormGroup }

export type FormLayoutConfigMapping = {
  [FormLayout.Column]: ColumnLayoutConfig
  [FormLayout.Rows]: RowLayoutConfig
  [FormLayout.Groups]: GroupLayoutConfig
}

export type FormDecoratorConfig<FL extends FormLayout> = {
  layout: FL
  layoutConfig: FormLayoutConfigMapping[FL]
}

export type FormMetaData<FL extends FormLayout> = {
  formConstructor: object
} & FormDecoratorConfig<FL>

export type FieldMetaData<FT extends FieldTypes> = {
  formConstructor: object
  fieldName: string
  type: FT
  config: FieldConfig<FT>
}

export type Translator = (
  translation: string,
  params: { [key: string]: string | number },
) => string
