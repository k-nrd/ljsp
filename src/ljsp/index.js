import {
  isNumber,
  isBool,
  isLjspStr,
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
} from '../lib/expressions'

import createEnv from './env'
import GlobalEnvironment from './global'
import Transformer from './transformer'
import * as Parser from '../parser/ljsp-parser'
import * as fs from 'fs'

export default function createLjsp(g = GlobalEnvironment) {
  const global = g
  const transformer = new Transformer()

  function evaluate (exp, env = global) {
    if (isNumber(exp) || isBool(exp)) {
      return exp
    } else if (isLjspStr(exp)) {
      return exp.slice(1, -1)
    } else if (isVarExpression(exp)) {
      return varExp(exp, env)
    } else if (isVarName(exp)) {
      return varAcc(exp, env)
    } else if (isBlockExpression(exp)) {
      return blockExp(exp, createEnv({}, env))
    } else if (isAssignExpression(exp)) {
      return assignExp(exp, env)
    } else if (isAssignOp(exp)) {
      return evaluate(transformer.opToAssign(exp), env)
    } else if (isIfExpression(exp)) {
      return ifExp(exp, env)
    } else if (isSwitchExpression(exp)) {
      return evaluate(transformer.switchToIf(exp), env)
    } else if (isWhileExpression(exp)) {
      return whileExp(exp, env)
    } else if (isForExpression(exp)) {
      return evaluate(transformer.whileToFor(exp), env)
    } else if (isDefExpression(exp)) {
      return evaluate(transformer.defToLambda(exp), env)
    } else if (isLambdaExpression(exp)) {
      return lambdaExp(exp, env)
    } else if (isClassExpression(exp)) {
      return classExp(exp, env)
    } else if (isNewExpression(exp)) {
      return newExp(exp, env)
    } else if (isPropExpression(exp)) {
      return propExp(exp, env)
    } else if (isModuleExpression(exp)) {
      return moduleExp(exp, env)
    } else if (isImportExpression(exp)) {
      return importExp(exp, env)
    } else if (isSuperExpression(exp)) {
      return superExp(exp, env)
    } else if (isList(exp)) {
      return functionCall(exp, env)
    } else {
      throw `Unimplemented: ${JSON.stringify(exp)}`
    }
  }

  function run (...exps) {
    return blockExp(['block', ...exps], global)
  }

  function varExp (exp, env) {
    const [, name, value] = exp
    if (isVarName(name)) {
      return env.define(name, evaluate(value, env))
    } else {
      throw `Invalid variable name: ${name}`
    }
  }

  function varAcc (name, env) {
    return env.lookup(name)
  }

  function blockExp (exp, env) {
    let result
    [...exp.slice(1)].forEach((exp) => {
      result = evaluate(exp, env)
    })
    return result
  }

  function assignExp (exp, env) {
    const [, ref, value] = exp
    if (isPropExpression(ref)) {
      const [, instance, propName] = ref
      const instanceEnv = evaluate(instance, env)
      return instanceEnv.define(propName, evaluate(value, env))
    } else if (varAcc(ref, env) !== value) {
      env.assign(ref, evaluate(value, env))
    }
    return evaluate(value, env)
  }

  function ifExp (exp, env) {
    const [, cond, cons, alt] = exp
    if (evaluate(cond, env)) {
      return evaluate(cons, env)
    } else {
      return evaluate(alt, env)
    }
  }

  function lambdaExp (exp, env) {
    const [, params, body] = exp
    const validParams = [...params].reduce(
      (acc, p) => acc && isVarName(p), true,
    )

    if (!validParams) {
      throw `Invalid parameter name: ${params}`
    }

    return {
      params,
      body,
      env,
    }
  }

  function whileExp (exp, env) {
    const [, cond, block] = exp
    let result
    while (evaluate(cond, env)) {
      result = evaluate(block, env)
    }

    if (result == null) {
      throw `Undefined while declaration: ${JSON.stringify(exp)}`
    }

    return result
  }

  function functionCall (exp, env) {
    const fn = evaluate(exp[0], env)
    const args = exp
      .slice(1)
      .map(arg => evaluate(arg, env))

    if (typeof fn === 'function') {
      return fn(...args)
    } else if (typeof fn === 'object') {
      return callUserDefinedFn(fn, args)
    }
  }

  function callUserDefinedFn (fn, args) {
    const activationRecord = {}
    const params = [...fn.params]
    params.forEach((p, idx) => {
      activationRecord[p] = args[idx]
    })
    const activationEnv = createEnv(activationRecord, fn.env)
    return evaluate(fn.body, activationEnv)
  }

  function classExp (exp, env) {
    const [, name, parent, body] = exp

    // Class is an environment with access to parent env
    const parentEnv = evaluate(parent, env) || env
    const classEnv = createEnv({}, parentEnv)

    // Its body is evaluated on its env
    blockExp(body, classEnv)

    // It is accessible by name in the parent env
    return env.define(name, classEnv)
  }

  function newExp (exp, env) {
    const classEnv = evaluate(exp[1], env)
    const instanceEnv = createEnv({}, classEnv)
    const args = exp
      .slice(2)
      .map(arg => evaluate(arg, env))

    callUserDefinedFn(
      classEnv.lookup('constructor'),
      [instanceEnv, ...args],
    )

    return instanceEnv
  }

  function propExp (exp, env) {
    const [, instance, name] = exp
    const instanceEnv = evaluate(instance, env)
    return instanceEnv.lookup(name)
  }

  function moduleExp (exp, env) {
    const [, name, body] = exp

    const moduleEnv = createEnv({}, env)
    blockExp(body, moduleEnv)

    return env.define(name, moduleEnv)
  }

  function importExp (exp, _) {
    const [, name] = exp
    const moduleSrc = fs.readFileSync(`./modules/${name}.ljsp`, 'utf-8')
    const body = Parser.parse(`(begin ${moduleSrc})`)
    const moduleExp = ['module', name, body]
    return evaluate(moduleExp, global)
  }

  function superExp (exp, env) {
    const [, className] = exp
    return evaluate(className, env).parent
  }

  return {
    global,
    evaluate,
    run,
  }
}

