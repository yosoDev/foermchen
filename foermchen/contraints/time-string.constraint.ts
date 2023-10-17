import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsTimeString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimeString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string') {
            return false
          }

          return /^([01][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/.test(value)
        },
      },
    })
  }
}
