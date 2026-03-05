// import type { LaunchOptions } from '@playwright/test'
// const browserOptions: LaunchOptions = {
//   slowMo: 0,
//   args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
//   firefoxUserPrefs: {
//     'media.navigator.streams.fake': true,
//     'media.navigator.permission.disabled': true,
//   },
//   headless: false,
// }
export const config = {
  // browser: 'chromium',
  // browserOptions,
  // IMG_THRESHOLD: { threshold: 0.4 },
  KUMA_BASE_URL: 'http://localhost:8080/gui',
  KUMA_BASE_API_URL: 'http://localhost:5681',
  KUMA_NEGATIVE_TIMEOUT: '4000',
}
