import { registerDecorator, ValidationOptions } from 'class-validator'
import { date } from 'quasar'

export function IsDateString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string') {
            return false
          }

          // simple structural check
          if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
            return false
          }

          return date.isValid(value)
        },
      },
    })
  }
}
