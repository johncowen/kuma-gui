interface MetricRecord {
  [key: string]: MetricRecord | string | number
}
type Entry = {
  name: string
  cluster?: Record<string, unknown>
  http?: Record<string, unknown>
  tcp?: Record<string, unknown>
}

// just does the inital response to JSON parsing
export const parse = (lines: string) => {
  // for each line
  return lines.trim().split('\n').filter((item) => {
    // only use data prefixed with either cluster. http. or tcp.
    return ['cluster.', 'http.', 'tcp.'].some(prop => item.startsWith(prop))
  }).reduce((prev, item) => {
    // split the `key: values` on the `:` and normalize the value
    const [key, ...value] = item.trim().split(':')
    const val = ((val) => {
      try {
        return JSON.parse(val)
      } catch (e) {
        return val
      }
    })(value.join(':').trim())

    // walk the path creating `json.objects: value`
    key.split('.').reduce((prev, item, i, arr) => {
      if (i === arr.length - 1) {
        // if this is the last segment in the path
        // then just set the value
        prev[item] = val
        return prev
      }
      // otherwise add a {} if its not there already
      // and return that as prev so we can continue appending
      if (typeof prev[item] === 'undefined') {
        const val = {}
        prev[item] = val
        return val
      } else {
        return prev[item]
      }
    }, prev)

    return prev
  }, {} as MetricRecord)
}

// lets you specify the things you are interested in
export const getTraffic = (json: ReturnType<typeof parse>, filter: (key: string) => boolean): Entry[] => {
  const protocols = ['cluster', 'http', 'tcp'] as const
  const traffic: Record<string, Entry> = {}
  protocols.map((item) => {
    return Object.entries(json[item]).filter(([key, _value]) => {
      return filter(key)
    }).forEach(([key, value]) => {
      if (typeof traffic[key] === 'undefined') {
        traffic[key] = {
          name: key,
        }
      }
      traffic[key][item] = value
    })
  })
  return Object.values(traffic)
}
