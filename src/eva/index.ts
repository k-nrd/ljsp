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
  isForExpression,
  isAssignOp,
  isClassExpression,
  isNewExpression,
  isPropExpression,
  isSuperExpression,
  isModuleExpression,
  isImportExpression,
} from '../lib/type-guards'

import Env from './env'
import GlobalEnvironment from './global'
import Transformer from './transformer'
import * as Parser from '../parser/eva-parser'
import * as fs from 'fs'

class Eva {
  global: Env
  private transformer: Transformer
  constructor(global = GlobalEnvironment) {
    this.global = global
    this.transformer = new Transformer()
  }

  public eval (exp: Expression, env: Env = this.global): Expression {
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
      return this.blockExp(exp, new Env({}, env))
    } else if (isAssignExpression(exp)) {
      return this.assignExp(exp, env)
    } else if (isAssignOp(exp)) {
      return this.eval(this.transformer.opToAssign(exp), env)
    } else if (isIfExpression(exp)) {
      return this.ifExp(exp, env)
    } else if (isSwitchExpression(exp)) {
      return this.eval(this.transformer.switchToIf(exp), env)
    } else if (isWhileExpression(exp)) {
      return this.whileExp(exp, env)
    } else if (isForExpression(exp)) {
      return this.eval(this.transformer.whileToFor(exp), env)
    } else if (isDefExpression(exp)) {
      return this.eval(this.transformer.defToLambda(exp), env)
    } else if (isLambdaExpression(exp)) {
      return this.lambdaExp(exp, env)
    } else if (isClassExpression(exp)) {
      return this.classExp(exp, env)
    } else if (isNewExpression(exp)) {
      return this.newExp(exp, env)
    } else if (isPropExpression(exp)) {
      return this.propExp(exp, env)
    } else if (isModuleExpression(exp)) {
      return this.moduleExp(exp, env)
    } else if (isImportExpression(exp)) {
      return this.importExp(exp, env)
    } else if (isSuperExpression(exp)) {
      return this.superExp(exp, env)
    } else if (isList(exp)) {
      return this.functionCall(exp, env)
    }
    throw `Unimplemented: ${JSON.stringify(exp)}`
  }

  public run (...exps: List): Expression {
    return this.blockExp(['block', ...exps], this.global)
  }

  private varExp (exp: List, env: Env): Expression {
    const [, name, value] = exp
    if (isVarName(name)) {
      return env.define(name, this.eval(value, env))
    } else {
      throw `Invalid variable name: ${name}`
    }
  }

  private varAcc (name: VarName, env: Env): Expression {
    return env.lookup(name)
  }

  private blockExp (exp: List, env: Env): Expression {
    let result
    const [, ...exps] = exp
    exps.forEach((exp: Expression) => {
      result = this.eval(exp, env)
    })
    return result
  }

  private assignExp (exp: List, env: Env): Expression {
    const [, ref, value] = exp
    if (isPropExpression(ref)) {
      const [, instance, propName] = ref
      const instanceEnv = this.eval(instance, env)
      return instanceEnv.define(propName, this.eval(value, env))
    } else if (this.varAcc(ref, env) !== value) {
      env.assign(ref, this.eval(value, env))
    }
    return this.eval(value, env)
  }

  private ifExp (exp: List, env: Env): Expression {
    const [, cond, cons, alt] = exp
    if (this.eval(cond, env)) {
      return this.eval(cons, env)
    } else {
      return this.eval(alt, env)
    }
  }

  private lambdaExp (exp: List, env: Env): Expression {
    const [, params, body] = exp
    const validParams = [...params].reduce(
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

  private whileExp (exp: List, env: Env): Expression {
    const [, cond, block] = exp
    let result
    while (this.eval(cond, env)) {
      result = this.eval(block, env)
    }
    if (result == null) {
      throw `Undefined while declaration: ${JSON.stringify(exp)}`
    }
    return result
  }

  private functionCall (exp: List, env: Env): Expression {
    const fn = this.eval(exp[0], env)
    const args = exp
      .slice(1)
      .map(arg => this.eval(arg, env))

    if (typeof fn === 'function') {
      return fn(...args)
    } else if (typeof fn === 'object') {
      return this.callUserDefinedFn(fn, args)
    }
  }

  private callUserDefinedFn (fn: Record<string, Expression>, args: List): Expression {
    const activationRecord: {[k: string]: Expression} = {}
    const params = [...fn.params]
    params.forEach((p: VarName, idx: number) => {
      activationRecord[p] = args[idx]
    })
    const activationEnv = new Env(activationRecord, fn.env)
    return this.eval(fn.body, activationEnv)
  }

  private classExp (exp: List, env: Env): Expression {
    const [, name, parent, body] = exp

    // Class is an environment with access to parent env
    const parentEnv = this.eval(parent, env) || env
    const classEnv = new Env({}, parentEnv)

    // Its body is evaluated on its env
    this.blockExp(body, classEnv)

    // It is accessible by name in the parent env
    return env.define(name, classEnv)
  }

  private newExp (exp: List, env: Env): Expression {
    const classEnv = this.eval(exp[1], env)
    const instanceEnv = new Env({}, classEnv)
    const args = exp
      .slice(2)
      .map(arg => this.eval(arg, env))

    this.callUserDefinedFn(
      classEnv.lookup('constructor'),
      [instanceEnv, ...args],
    )

    return instanceEnv
  }

  private propExp (exp: Expression, env: Env): Expression {
    const [, instance, name] = exp
    const instanceEnv = this.eval(instance, env)
    return instanceEnv.lookup(name)
  }

  private moduleExp (exp: Expression, env: Env): Expression {
    const [, name, body] = exp

    const moduleEnv = new Env({}, env)
    this.blockExp(body, moduleEnv)

    return env.define(name, moduleEnv)
  }

  private importExp (exp: Expression, _: Env): Expression {
    const [, name] = exp
    const moduleSrc = fs.readFileSync(`./modules/${name}.eva`, 'utf-8')
    const body = Parser.parse(`(begin ${moduleSrc})`)
    const moduleExp = ['module', name, body]
    return this.eval(moduleExp, this.global)
  }

  private superExp (exp: Expression, env: Env): Expression {
    const [, className] = exp
    return this.eval(className, env).parent
  }
}

export default Eva
