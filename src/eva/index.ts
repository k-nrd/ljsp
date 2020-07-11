import {
  Expression,
  VarName,
  List,
} from '../lib/types'

import {
  isNumber,
  isBool,
  isEvaString,
  isVarExpression,
  isVarName,
  isBlockExpression,
  isAssignExpression,
  isIfExpression,
  isWhileExpression,
  isList,
  isDefExpression,
  isLambdaExpression,
  isSwitchExpression,
} from '../lib/type-guards'

import Env from './env'
import GlobalEnvironment from './global'
import Transformer from './transformer'

class Eva {
  global: Env
  private transformer: Transformer
  constructor(global = GlobalEnvironment) {
    this.global = global
    this.transformer = new Transformer()
  }

  public eval(exp: Expression, env: Env = this.global): Expression {
    if (isNumber(exp)) {
      return exp
    } else if (isBool(exp)) {
      return exp
    } else if (isEvaString(exp)) {
      return exp.slice(1, -1)
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
    } else if (isSwitchExpression(exp)) {
      return this.eval(this.transformer.switchToIf(exp), env)
    } else if (isWhileExpression(exp)) {
      return this.whileExp(exp, env)
    } else if (isDefExpression(exp)) {
      return this.eval(this.transformer.defToLambda(exp), env)
    } else if (isLambdaExpression(exp)) {
      return this.lambdaExp(exp, env)
    } else if (isList(exp)) {
      return this.functionCall(exp, env)
    }
    throw `Unimplemented: ${JSON.stringify(exp)}`
  }

  private varExp(exp: List, env: Env): Expression {
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

  private blockExp(exp: List, env: Env): Expression {
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

  private assignExp(exp: List, env: Env): Expression {
    const [_, name, value] = exp
    if (this.varAcc(name, env) !== value) {
      env.assign(name, this.eval(value, env))
    }
    return value
  }

  private ifExp(exp: List, env: Env): Expression {
    const [_, cond, cons, alt] = exp
    if (this.eval(cond, env)) {
      return this.eval(cons, env)
    } else {
      return this.eval(alt, env)
    }
  }

  private lambdaExp(exp: List, env: Env): Expression {
    const [_, params, body] = exp
    const validParams = params.reduce(
      (acc: boolean, p: Expression) => acc && isVarName(p), true,
    )

    if (!validParams) {
      throw `Invalid parameter name: ${params}`
    } else {
      return {
        params,
        body,
        env,
      }
    }
  }

  private whileExp(exp: List, env: Env): Expression {
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

  private functionCall(exp: List, env: Env): Expression {
    const fn = this.eval(exp[0], env)
    const args = exp.slice(1).map(arg => this.eval(arg, env))

    if (typeof fn === 'function') {
      return fn(...args)
    } else if (typeof fn === 'object') {
      const activationRecord: { [k: string]: Expression } = {}
      fn.params.forEach((p: VarName, idx: number) => {
        activationRecord[p] = args[idx]
      })
      const activationEnv = new Env(activationRecord, fn.env)
      return this.eval(fn.body, activationEnv)
    }
  }
}

export default Eva
