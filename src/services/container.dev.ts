import { injected, Container } from 'brandi'
import container, { TOKENS } from './container.prod'
import Env from '@/services/env'
export { TOKENS } from './container.prod'
class MaybeCookieEnv extends Env {
  var(...rest: Parameters<Env['var']>) {
    const cookies = document.cookie.split(';')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .reduce((prev, item) => {
        const [key, value] = item.split('=')
        prev[key] = value
        return prev
      }, {} as Record<string, string>)
    const key = rest[0]
    if (cookies[rest[0]] !== undefined) {
      console.log(key, cookies[key])
      return cookies[key]
    }
    return super.var(...rest)
  }
}
const child = new Container().extend(container)
child.bind(TOKENS.Env)
  .toInstance(MaybeCookieEnv)
  .inSingletonScope()
injected(MaybeCookieEnv, TOKENS.EnvVars)
export default child
