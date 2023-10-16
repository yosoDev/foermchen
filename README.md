# Förmchen (foermchen)

Förmchen is a form builder for Quasar

> [!IMPORTANT]
> Förmchen is currently in very early development and should not yet be used.
>
> I plan on publishing Förmchen as a package on npm (including a proper quasar extension)
> once it is feature-complete and stable.
> Until then, feature requests are welcome, but I can't promise that I will implement them.
>
> My current list of todos can be found further down.


## Install the dependencies

```bash
$ npm i
```

## Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
$ quasar dev
```

## Linting and formatting

```bash
# linting with --fix
$ npm run lint

# formatting
$ npm run format

# formatting and linting
$ npm run code:fix
```


## Using Förmchen
First, we'll need a form class.
The class can be named anything, but needs to extend `AbstractForm` and has to have the `@Form` decorator.
This class should be exported from a file outside any vue component to prevent issues with usage of decorators and Vite.
```ts
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
```

The field decorators can be used to register class properties as form fields.
Validation can be added with any decorator from `class-validator`.

Once a class is created, it can be used to create an instance of `Foermchen`:
```ts
const demoForm = new Foermchen(DemoForm)
```

This instance can be passed to the `FoermchenRenderer` component, which will render the form:
```vue
<foermchen-renderer :form="demoForm" />
```

Förmchen needs some metadata objects to be registered.
Ideally this is done in a quasar boot file:
```ts
// src/boot/formMetaData.ts
import { boot } from 'quasar/wrappers'

import { setupMetaDataStorage } from 'foermchen'

export default boot(() => {
  setupMetaDataStorage()
})
```

The `tsconfig.json` should contain these value:
```json5
{
  // ...
  "compilerOptions": {
    // ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "strictNullChecks": false,
    "paths": {
      "foermchen/*": ["foermchen/*"]
    }
  }
}
```

The custom path is optional, but makes imports a little cleaner.
If the custom path is used, it also needs to registered with Vite.
This can be done in `quasar.config.js`:
```js
{
  // ...
  extendViteConf(viteConf)
  {
    viteConf.resolve.alias.foermchen = path.resolve(
      __dirname,
      './foermchen',
    )
  }
}
```

The following ESLint rules are recommended when using Förmchen:
```json
{
  "@typescript-eslint/interface-name-prefix": "off",
  "@typescript-eslint/no-explicit-any": "off"
}
```


## Todos
> [!NOTE]
> This todo list is not complete and might change quite a lot.

- [ ] Publish as package
- [ ] Create Quasar extension
- [ ] Translations
  - [ ] Default translations
  - [ ] Support for external translation functions
- [ ] Ease use of validation decorators
  - [ ] Maybe add basic decorators like `IsString` and `IsNumber` to their respective field type decorator
- [ ] Custom validators
- [ ] Field type that can display arbitrary and reactive components
  - Maybe slot with form data as slot props
- [ ] Clean up types
- [ ] Clean up files and file structure
- [ ] Repeater fields
  - Allows a regular field to be repeated
  - Support for min and max
- [ ] Reset buttons
- [ ] Button positions, styles, texts
- [ ] Tab-indices
- [ ] Form styles
  - Setting for the entire form which controls the input style (dense, outlined, ...)
- [ ] Fix form styling
  - Clearances are weird in some cases, e.g. when errors or hints are displayed