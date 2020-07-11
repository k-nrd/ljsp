import { List, Expression } from '../lib/types'
import { isVarName } from '../lib/type-guards'

class Transformer {
  // Syntactic sugar for
  // (var <name> (lambda <params> <body>))
  defToLambda(exp: List): List {
    const  [_, name, params, body] = exp

    if (!isVarName(name)) {
      throw `Invalid variable name: ${name}.`
    } else {
      return ['var', name, ['lambda', params, body]]
    }
  }

  switchToIf(exp: List): Expression {
    const [_, ...cases] = exp

    const ifExp = ['if', null, null, null]
    let current: List = ifExp

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCond, currentCons] = cases[i]
      current[1] = currentCond
      current[2] = currentCons

      // if next case is else, set its block as alternative to consequence
      // else, create nested if expression
      const [nextCond, nextCons] = cases[i + 1]
      current[3] = nextCond === 'else' ? nextCons : ['if']

      current = current[3]
    }

    return ifExp
  }
}

export default Transformer
