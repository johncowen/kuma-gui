interface I18nRecord {
  [key: string]: I18nRecord | string
}
export default (strs: I18nRecord) => {
  return {
    t: (path: string) => {
      return path.split('.').reduce<I18nRecord | string>((prev, item) => {
        if (typeof prev !== 'string') {
          if (item in prev) {
            return prev[item]
          }
          throw new Error(`i18n path '${path}' not found`)
        }
        return prev
      }, strs)
    },
  }
}
