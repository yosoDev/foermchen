import { MinLength } from 'class-validator'

import {
  AbstractForm,
  DateField,
  DateTimeField,
  Form,
  FormLayout,
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
}

export { DemoForm }
