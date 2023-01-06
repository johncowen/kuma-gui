type EnvVars = {
  KUMA_VERSION: string
  KUMA_DOCS_URL: string
  KUMA_UTM_QUERY_PARAMS: string
  KUMA_FEEDBACK_URL: string
}
export const useEnv = ({ version = '' }) => {
  const env: EnvVars = {
    KUMA_VERSION: version,
    KUMA_DOCS_URL: `${import.meta.env.VITE_DOCS_BASE_URL}/${version}/`,
    // remove the ? for now incase we need to append to an already query
    // param'ed URL
    KUMA_UTM_QUERY_PARAMS: import.meta.env.VITE_UTM.substring(1),
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
  }

  return (key: keyof typeof env) => {
    return env[key]
  }
}
