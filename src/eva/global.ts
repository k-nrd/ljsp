import Env from './env'

const GlobalEnvironment = new Env({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
  '+': (op1: number, op2: number): number => op1+op2,
  '-': (op1: number, op2?: number): number => (op2 == null) ? -op1 : op1 - op2,
  '*': (op1: number, op2: number): number => op1*op2,
  '/': (op1: number, op2: number): number => op1/op2,
  '>': (op1: number, op2: number): boolean => op1 > op2,
  '<': (op1: number, op2: number): boolean => op1 < op2,
  '>=': (op1: number, op2: number): boolean => op1 >= op2,
  '<=': (op1: number, op2: number): boolean => op1 <= op2,
  '==': (op1: number, op2: number): boolean => op1 === op2,
  '!=': (op1: number, op2: number): boolean => op1 !== op2,
  // eslint-disable-next-line
  print: (...args: any[]) => console.log(...args),
})

export default GlobalEnvironment
