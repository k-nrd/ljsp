import {
  Expression,
  List,
  VarName,
  EvaString,
} from './types'

function isNumber(exp: Expression): exp is number {
  return typeof exp === 'number'
}

function isBool(exp: Expression): exp is boolean {
  return typeof exp === 'boolean'
}

function isString(exp: Expression): exp is string {
  return typeof exp === 'string'
}

function isEvaString(exp: Expression): exp is EvaString {
  return isString(exp) && exp[0] === '"' && exp.slice(-1) === '"'
}

function isVarName(exp: Expression): exp is VarName {
  return isString(exp) && /^[+\-=*/<>a-zA-Z]+[a-zA-Z0-9_]*$/.test(exp)
}

function isList(exp: Expression): exp is List {
  return Array.isArray(exp)
}

function isVarExpression(exp: List): boolean {
  return exp[0] === 'var'
}

function isBlockExpression(exp: List): boolean {
  return exp[0] === 'begin'
}

function isAssignExpression(exp: List): boolean {
  return exp[0] === 'set'
}

function isIfExpression(exp: List): boolean {
  return exp[0] === 'if'
}

function isSwitchExpression(exp: List): boolean {
  return exp[0] === 'switch'
}

function isWhileExpression(exp: List): boolean {
  return exp[0] === 'while'
}

function isDefExpression(exp: List): boolean {
  return exp[0] === 'def'
}

function isLambdaExpression(exp: List): boolean {
  return exp[0] === 'lambda'
}

function isFunctionCall(exp: List): boolean {
  return isVarName(exp[0])
}

export {
  isNumber,
  isString,
  isBool,
  isEvaString,
  isList,
  isVarExpression,
  isVarName,
  isBlockExpression,
  isAssignExpression,
  isIfExpression,
  isWhileExpression,
  isFunctionCall,
  isDefExpression,
  isLambdaExpression,
  isSwitchExpression,
}
