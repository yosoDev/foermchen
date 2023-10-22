import { boot } from 'quasar/wrappers'

import { setupMetaDataStorage, setupTranslator } from 'foermchen'
import { translate } from './i18n'

export default boot(() => {
  setupMetaDataStorage()
  setupTranslator(translate)
})
