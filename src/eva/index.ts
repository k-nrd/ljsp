import {
  Expression,
  NumOpExpression,
  CompExpression,
  VarDeclaration,
  VarName,
  BlockDeclaration,
  AssignDeclaration,
  IfDeclaration,
} from '../lib/types'

import {
  isNumber,
  isBool,
  isEvaString,
  isNumOp,
  isCompOp,
  isVarDeclaration,
  isVarName,
  isBlockDeclaration,
  isAssignDeclaration,
  isIfDeclaration,
} from '../lib/type-guards'

import Env from './env'

class Eva {
  global: Env
  constructor(global = new Env()) {
    this.global = global
  }

  public eval(exp: Expression, env: Env = this.global): Expression {
    if (isNumber(exp)) {
      return exp
    } else if (isBool(exp)) {
      return exp
    } else if (isEvaString(exp)) {
      return exp.slice(1, -1)
    } else if (isNumOp(exp)) {
      return this.numOp(exp, env)
    } else if (isCompOp(exp)) {
      return this.compOp(exp, env)
    } else if (isVarDeclaration(exp)) {
      return this.varDec(exp, env)
    } else if (isVarName(exp)) {
      return this.varAcc(exp, env)
    } else if (isBlockDeclaration(exp)) {
      const blockEnv = new Env({}, env)
      return this.blockDec(exp, blockEnv)
    } else if (isAssignDeclaration(exp)) {
      return this.assignDec(exp, env)
    } else if (isIfDeclaration(exp)) {
      return this.ifDec(exp, env)
    }
    throw `Unimplemented: ${JSON.stringify(exp)}`
  }

  private numOp(exp: NumOpExpression, env: Env): number {
    const [op, x, y] = [
      exp[0] as string,
      this.eval(exp[1], env) as number,
      this.eval(exp[2], env) as number,
    ]

    if (op === '+') {
      return x + y
    } else if (op === '*') {
      return x * y
    } else if (op === '-') {
      return x - y
    } else if (op === '/') {
      return x / y
    } else {
      throw `Unimplemented: ${JSON.stringify(exp)}`
    }
  }

  private compOp(exp: CompExpression, env: Env): boolean {
    const [op, x, y] = [
      exp[0] as string,
      this.eval(exp[1], env) as number,
      this.eval(exp[2], env) as number,
    ]

    if (op === '==') {
      return x === y
    } else if (op === '!=') {
      return x !== y
    } else if (op === '<') {
      return x < y
    } else if (op === '>') {
      return x > y
    } else if (op === '>=') {
      return x >= y
    } else if (op === '<=') {
      return x <= y
    } else {
      throw `Unimplemented: ${JSON.stringify(exp)}`
    }
  }

  private varDec(exp: VarDeclaration, env: Env): Expression {
    const [_, name, value] = exp
    if (isVarName(name)) {
      return env.define(name, this.eval(value, env))
    } else {
      throw `Invalid variable name: ${name}`
    }
  }

  private varAcc(name: VarName, env: Env): Expression {
    return env.lookup(name)
  }

  private blockDec(exp: BlockDeclaration, env: Env): Expression {
    const [_, ...exps] = exp
    let result
    exps.forEach((exp: Expression) => {
      result = this.eval(exp, env)
    })
    if (result == null) {
      throw `Undefined block declaration: ${JSON.stringify(exp)}`
    }
    return result
  }

  private assignDec(exp: AssignDeclaration, env: Env): Expression {
    const [_kw, name, value] = exp
    if (this.varAcc(name, env) !== value) {
      env.assign(name, this.eval(value, env))
    }
    return value
  }

  private ifDec(exp: IfDeclaration, env: Env): Expression {
    const [_kw, cond, cons, alt] = exp
    if (this.eval(cond, env)) {
      return this.eval(cons, env)
    } else {
      return this.eval(alt, env)
    }
  }
}

export default Eva
