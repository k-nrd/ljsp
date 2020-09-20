import { eva, e } from './setup'

//
// Math ops
// (+ <number> <number>)
//
test('evaluate addition', () => {
  expect(eva.eval(e`(+ 2 3)`)).toEqual(5)
})

test('evaluate nested addition', () => {
  expect(eva.eval(e`(+ (+ 1 2) 5)`)).toEqual(8)
})

test('evaluate subtraction', () => {
  expect(eva.eval(e`(- 3 2)`)).toEqual(1)
})

test('evaluate multiplication', () => {
  expect(eva.eval(e`(* 2 5)`)).toEqual(10)
})

test('evaluate division', () => {
  expect(eva.eval(e`(/ 10 2)`)).toEqual(5)
})
