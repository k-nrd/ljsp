export default class Eva {
  public eval(exp: Expression): Expression {
    if (isNumber(exp)) {
      return exp
    } else if (isString(exp)) {
      return exp
    } else if (isList(exp)) {
      return this.evalList(exp)
    }
    throw 'Unimplemented'
  }

  private evalList(exp: List): Expression {
    switch (exp[0]) {
    case '+':
      return this.add(this.eval(exp[1]), this.eval(exp[2]))
    }
  }

  private add(x: Expression, y: Expression): Expression {
    if (isNumber(x) && isNumber(y)) {
      return x + y
    } else if (isString(x) && isString(y)) {
      return x + y
    } else {
      throw 'Can\'t add different types'
    }
  }
}

type Expression = number | string | List

interface List {
  [index: number]: Expression
  0: Op
}

type Op = '+'

function isNumber(exp: Expression): exp is number {
  return typeof exp === 'number'
}

function isString(exp: Expression): exp is string {
  return typeof exp === 'string'
}

function isList(exp: Expression): exp is List {
  return Array.isArray(exp)
}
