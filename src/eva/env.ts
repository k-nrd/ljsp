import {Expression, VarName} from '../lib/types'

class Env {
  record: {[k: string]: Expression}
  parent?: Env
  constructor(record = {}, parent?: Env) {
    this.record = record
    this.parent = parent
  }

  define(name: VarName, value: Expression): Expression {
    this.record[name] = value
    return value
  }

  assign(name: VarName, value: Expression): Expression {
    this.resolve(name).record[name] = value
    return value
  }

  lookup(name: VarName): Expression {
    return this.resolve(name).record[name]
  }

  private hasKey(name: VarName): boolean {
    return Object.prototype.hasOwnProperty.call(this.record, name)
  }

  private resolve(name: VarName): Env {
    if (this.hasKey(name)) {
      return this
    }

    if (this.parent == null) {
      throw new ReferenceError(`Variable ${name} not defined`)
    }

    return this.parent.resolve(name)
  }
}

export default Env
