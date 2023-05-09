# I18n

i18n utilities for translation (machine to human as well as other languages) and
generally managing lots of dynamic strings.

'Project global' locales are stored as yaml files in `src/locales/en-us/*`, but
in the future we should be able to store locales colocated alongside the
components that use them.

Our `t` function does not currently support full i18n interpolation,
pluralization utilities, date utilities etc.

## Usage

```vue
// from within components

const { t } = useI18n()

// 'project global' text
{{ t('http.api.mtls') }}

// component specific text
{{ t('component.dataplane-detail-view.title') }}
```

