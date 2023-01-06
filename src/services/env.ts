
export type EnvVars = {
  KUMA_NAME: string
  KUMA_VERSION: string
  KUMA_BASE_PATH: string
  KUMA_API_URL: string
  KUMA_DOCS_URL: string
  KUMA_UTM_QUERY_PARAMS: string
  KUMA_FEEDBACK_URL: string
  KUMA_CHAT_URL: string
  KUMA_INSTALL_URL: string
}
export default class Env {
  env: EnvVars
  constructor(env: EnvVars) {
    this.env = env
  }

  var(key: keyof EnvVars) {
    return this.env[key]
  }
}
