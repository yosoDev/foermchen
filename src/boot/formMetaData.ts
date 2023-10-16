import { boot } from 'quasar/wrappers'

import { setupMetaDataStorage } from 'foermchen'

export default boot(() => {
  setupMetaDataStorage()
})
