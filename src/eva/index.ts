import {
  Expression,
  NumOpExpression,
  CompExpression,
  VarExpression,
  VarName,
  BlockExpression,
  AssignExpression,
  IfExpression,
  WhileExpression,
} from '../lib/types'

import {
  isNumber,
  isBool,
  isEvaString,
  isNumOp,
  isCompOp,
  isVarExpression,
  isVarName,
  isBlockExpression,
  isAssignExpression,
  isIfExpression,
  isWhileExpression,
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
    } else if (isVarExpression(exp)) {
      return this.varExp(exp, env)
    } else if (isVarName(exp)) {
      return this.varAcc(exp, env)
    } else if (isBlockExpression(exp)) {
      const blockEnv = new Env({}, env)
      return this.blockExp(exp, blockEnv)
    } else if (isAssignExpression(exp)) {
      return this.assignExp(exp, env)
    } else if (isIfExpression(exp)) {
      return this.ifExp(exp, env)
    } else if (isWhileExpression(exp)) {
      return this.whileExp(exp, env)
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

  private varExp(exp: VarExpression, env: Env): Expression {
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

  private blockExp(exp: BlockExpression, env: Env): Expression {
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

  private assignExp(exp: AssignExpression, env: Env): Expression {
    const [_, name, value] = exp
    if (this.varAcc(name, env) !== value) {
      env.assign(name, this.eval(value, env))
    }
    return value
  }

  private ifExp(exp: IfExpression, env: Env): Expression {
    const [_, cond, cons, alt] = exp
    if (this.eval(cond, env)) {
      return this.eval(cons, env)
    } else {
      return this.eval(alt, env)
    }
  }

  private whileExp(exp: WhileExpression, env: Env): Expression {
    const [_, cond, block] = exp
    let result
    while (this.eval(cond, env)) {
      result = this.eval(block, env)
    }
    if (result == null) {
      throw `Undefined while declaration: ${JSON.stringify(exp)}`
    }
    return result
  }
}

export default Eva
