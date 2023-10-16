import { FormDataRef } from 'foermchen'

export function isFieldDisabled(
  disabledConfig: boolean | string,
  formDataRef: FormDataRef,
): boolean {
  if (typeof disabledConfig === 'string') {
    return !!formDataRef.value?.[disabledConfig]
  }

  return disabledConfig
}
