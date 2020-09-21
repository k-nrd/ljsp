export function isNumber (exp) {
  return typeof exp === 'number'
}

export function isBool (exp) {
  return typeof exp === 'boolean'
}

export function isString (exp) {
  return typeof exp === 'string'
}

export function isLjspStr (exp) {
  return isString(exp) && exp[0] === '"' && exp.slice(-1) === '"'
}

export function isVarName (exp) {
  return isString(exp) && /^[+\-=*/<>a-zA-Z]+[a-zA-Z0-9_]*$/.test(exp)
}

export function isList (exp) {
  return Array.isArray(exp)
}

export function isVarExpression (exp) {
  return exp[0] === 'var'
}

export function isBlockExpression (exp) {
  return exp[0] === 'begin'
}

export function isAssignExpression (exp) {
  return exp[0] === 'set'
}

export function isIfExpression (exp) {
  return exp[0] === 'if'
}

export function isSwitchExpression (exp) {
  return exp[0] === 'switch'
}

export function isWhileExpression (exp) {
  return exp[0] === 'while'
}

export function isForExpression (exp) {
  return exp[0] === 'for'
}

export function isDefExpression (exp) {
  return exp[0] === 'def'
}

export function isLambdaExpression (exp) {
  return exp[0] === 'lambda'
}

export function isClassExpression (exp) {
  return exp[0] === 'class'
}

export function isNewExpression (exp) {
  return exp[0] === 'new'
}

export function isPropExpression (exp) {
  return exp[0] === 'prop'
}

export function isSuperExpression (exp) {
  return exp[0] === 'super'
}

export function isModuleExpression (exp) {
  return exp[0] === 'module'
}

export function isImportExpression (exp) {
  return exp[0] === 'import'
}

export function isAssignOp (exp) {
  return exp[0] === '++' || exp[0] === '--'
}

export function isFunctionCall (exp) {
  return isVarName(exp[0])
}
