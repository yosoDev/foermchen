import { IsString, MinLength } from 'class-validator'

import { AbstractForm, Form, FormLayout, TextField } from 'foermchen'

@Form({
  layout: FormLayout.Rows,
  layoutConfig: [],
})
class DemoForm extends AbstractForm {
  @TextField({ clearable: true })
  @IsString()
  @MinLength(3)
  username: string
}

export { DemoForm }
