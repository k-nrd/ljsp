import { isVarName } from '../lib/expressions'

// Syntactic sugar for
// (var <name> (lambda <params> <body>))
export function defToLambda(exp) {
  const  [_, name, params, body] = exp

  if (!isVarName(name)) {
    throw `Invalid variable name: ${name}.`
  } else {
    return ['var', name, ['lambda', params, body]]
  }
}

export function switchToIf(exp) {
  const [_, ...cases] = exp

  const ifExp = ['if', null, null, null]
  let current = ifExp

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

export function whileToFor(exp) {
  const [_, init, cond, mod, body] = exp

  return ['begin', init, ['while', cond, ['begin', body, mod]], body]
}

export function opToAssign(exp) {
  const [op, name] = exp

  switch (op) {
  case '++':
    return ['set', name, ['+', name, 1]]
  case '--':
    return ['set', name, ['-', name, 1]]
  default:
    throw `Unimplemented assignment operation: ${op}.`
  }
  
}
