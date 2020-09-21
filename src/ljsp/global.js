import createEnv from './env'

const GlobalEnvironment = createEnv({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
  '+': (op1, op2) => op1+op2,
  '-': (op1, op2) => (op2 == null) ? -op1 : op1 - op2,
  '*': (op1, op2) => op1*op2,
  '/': (op1, op2) => op1/op2,
  '>': (op1, op2) => op1 > op2,
  '<': (op1, op2) => op1 < op2,
  '>=': (op1, op2) => op1 >= op2,
  '<=': (op1, op2) => op1 <= op2,
  '==': (op1, op2) => op1 === op2,
  '!=': (op1, op2) => op1 !== op2,
  print: (...args) => console.log(...args),
})

export default GlobalEnvironment
