/** @returns {import('stylelint').Config} */

import { dirname } from 'node:path'

export function createStylelintConfig() {
  const x = new URL(dirname(import.meta.resolve('@kumahq/x/package.json'))).pathname
  return {
    extends: [
      'stylelint-config-html',
      'stylelint-config-recommended-scss',
      'stylelint-config-recommended-vue/scss',
    ],
    plugins: [
      '@stylistic/stylelint-plugin',
      '@kong/design-tokens/stylelint-plugin',
    ],
    ignoreFiles: [
      'dist/**/*',
      'playwright-report/**/*',
    ],
    'referenceFiles': [
      {
        files: `${x}/src/**/*.vue`,
        customSyntax: 'postcss-html',
      },
      {
        files: 'src/**/*.vue',
        customSyntax: 'postcss-html',
      },
    ],
    rules: {
      '@kong/design-tokens/use-proper-token': [
        true,
        {
          disableFix: true,
          severity: 'error',
        },
      ],
      'no-unknown-custom-properties': true,
      '@kong/design-tokens/token-var-usage': true,
      '@stylistic/selector-combinator-space-before': 'always',
      '@stylistic/selector-combinator-space-after': 'always',
      'no-duplicate-selectors': [null],
    },
  }
}
