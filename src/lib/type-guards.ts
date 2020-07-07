import {
  Expression,
  List,
  VarExpression,
  VarName,
  EvaString,
  BlockExpression,
  AssignExpression,
  IfExpression,
  WhileExpression,
  FunctionCall,
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

function isList(exp: Expression): exp is List {
  return Array.isArray(exp)
}

function isVarExpression(exp: List): exp is VarExpression {
  return exp[0] === 'var'
}

function isBlockExpression(exp: List): exp is BlockExpression {
  return exp[0] === 'begin'
}

function isAssignExpression(exp: List): exp is AssignExpression {
  return exp[0] === 'set'
}

function isIfExpression(exp: List): exp is IfExpression {
  return exp[0] === 'if'
}

function isWhileExpression(exp: List): exp is WhileExpression {
  return exp[0] === 'while'
}

function isFunctionCall(exp: List): exp is FunctionCall {
  return isVarName(exp[0])
}

function isVarName(exp: Expression): exp is VarName {
  return isString(exp) && /^[+\-*/<>=a-zA-Z][a-zA-Z0-9_]*$/.test(exp)
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
}
