export default function createEnv(r = {}, p) {
  const record = r
  const parent = p

  function define(name, value) {
    record[name] = value
    return value
  }

  function assign(name, value) {
    resolve(name).record[name] = value
    return value
  }

  function lookup(name) {
    return resolve(name).record[name]
  }

  function hasKey(name) {
    return Object.prototype.hasOwnProperty.call(record, name)
  }

  function resolve(name) {
    if (hasKey(name)) {
      return createEnv(record, parent)
    }

    if (parent == null) {
      throw new ReferenceError(`Variable ${name} not defined`)
    }

    return parent.resolve(name)
  }

  return Object.freeze({
    record,
    parent,
    define,
    assign,
    lookup,
    hasKey,
    resolve,
  })
}
