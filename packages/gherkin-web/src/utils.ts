import deepmerge from 'deepmerge'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'
import type { ArrayMergeOptions } from 'deepmerge'

// merges objects in array positions rather than replacing
const undefinedSymbol = Symbol('undefined')
const combineMerge = (target: object[], source: object[], options: ArrayMergeOptions): object[] => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

export const createSelector = (selectors: Record<string, string>) => {
  const resolve = (...args: string[]): string[] => {
    let selector = args[0]
    if (selector.startsWith('$')) {
      const alias = selector.split(/[: .[#]/).shift()!.substring(1)
      if (typeof selectors[alias] === 'undefined') {
        throw new Error(`Could not find alias $${alias}. Make sure you have defined the alias in a CSS selectors step`)
      }
      selector = selector.replace(`$${alias}`, selectors[alias])
      return resolve(selector, args[1])
    }
    return args
  }
  return resolve
}
export const merge = <T>(response: T, obj: Partial<T>): T => {
  const merged = deepmerge<T>(response, obj, { arrayMerge: combineMerge })
  return JSON.parse(JSON.stringify(merged, (_key, value) => {
    if (value === undefinedSymbol) {
      return
    }
    return value
  }))
}
export const YAML = {
  parse: (str: string) => {
    return jsYaml.load(str, {
      schema: DEFAULT_SCHEMA.extend([
        new Type('tag:yaml.org,2002:js/undefined', {
          kind: 'scalar',
          construct: () => {
            return undefinedSymbol
          },
        }),
      ]),
    })
  },
}

