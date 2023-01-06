import { Container, token, injected } from 'brandi'
import { PATH_CONFIG_DEFAULT } from '@/pathConfigDefault'
import { PathConfig } from '@/types/index'
import Env, { EnvVars } from '@/services/env'
export const container = new Container()

export const TOKENS = {
  Env: token<Env>('EnvService'),
  EnvVars: token<EnvVars>('EnvVars'),
}

const config = readPathConfigFromDom()
const version = semver(config.version)

const utm = `utm_source=${import.meta.env.VITE_NAMESPACE}&utm_medium=${import.meta.env.VITE_NAMESPACE}-GUI`
container
  .bind(TOKENS.Env)
  .toInstance(Env)
  .inSingletonScope()
container
  .bind(TOKENS.EnvVars)
  .toConstant({
    KUMA_NAME: `${import.meta.env.VITE_NAMESPACE}`,
    KUMA_VERSION: version.pre,
    KUMA_API_URL: config.apiUrl,
    KUMA_BASE_PATH: config.baseGuiPath,
    // TODO(jc): not totally sure we need to use a regex here, maybe just split and join if not
    KUMA_DOCS_URL: `${import.meta.env.VITE_DOCS_BASE_URL}/${version.patch === '0.0.0' ? 'dev' : version.patch.replace(/\.\d+$/, '.x')}`,
    // remove the ? for now incase we need to append to an already query
    // param'ed URL
    KUMA_UTM_QUERY_PARAMS: utm,
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
    KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
    KUMA_INSTALL_URL: `${import.meta.env.VITE_INSTALL_URL}?${utm}`,
  })

injected(Env, TOKENS.EnvVars)

export function semver(version: string): { major: string, minor: string, patch: string, pre: string } {
  const [major, minor, ...patchPre] = version.split('.')
  const [patch, pre] = patchPre.join('.').split('-')
  return {
    major,
    minor: `${major}.${minor}`,
    patch: `${major}.${minor}.${patch}`,
    pre: `${major}.${minor}.${patch}${pre !== undefined ? `-${pre}` : ''}`,
  }
}

/**
 * Reads the path config object from a JSON string found in a special script
 * tag that’s populated during server-side rendering of the Vue application’s
 * index.html file.
 */
function readPathConfigFromDom(): PathConfig {
  const pathConfigNode = document.querySelector('#kuma-config')

  if (pathConfigNode instanceof HTMLScriptElement) {
    try {
      return JSON.parse(pathConfigNode.innerText.trim())
    } catch {
      // Handled by falling back to a default value.
    }
  }

  // Falls back to a sensible default when encountering a malformed JSON payload
  // or non-replaced template.
  return PATH_CONFIG_DEFAULT
}

export default container
