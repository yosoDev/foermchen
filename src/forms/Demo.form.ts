import { MinLength } from 'class-validator'

import {
  AbstractForm,
  ColorField,
  DateField,
  DateTimeField,
  Form,
  FormLayout,
  MultiSelectField,
  SelectField,
  TextField,
  TimeField,
} from 'foermchen'

@Form({
  layout: FormLayout.Rows,
  layoutConfig: [],
})
class DemoForm extends AbstractForm {
  @TextField({ clearable: true })
  @MinLength(3)
  username: string

  @DateField({})
  birthday: string

  @TimeField({})
  eventTime: string

  @DateTimeField({})
  startDate: string

  @ColorField({})
  favouriteColor: string

  @SelectField({
    options: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ],
  })
  select: string

  @MultiSelectField({
    options: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ],
  })
  multiSelect: string[]
}

export { DemoForm }
