import { ljsp, e } from './setup'

//
// Math ops
// (+ <number> <number>)
//
test('evaluate addition', () => {
  expect(ljsp.evaluate(e`(+ 2 3)`)).toEqual(5)
})

test('evaluate nested addition', () => {
  expect(ljsp.evaluate(e`(+ (+ 1 2) 5)`)).toEqual(8)
})

test('evaluate subtraction', () => {
  expect(ljsp.evaluate(e`(- 3 2)`)).toEqual(1)
})

test('evaluate multiplication', () => {
  expect(ljsp.evaluate(e`(* 2 5)`)).toEqual(10)
})

test('evaluate division', () => {
  expect(ljsp.evaluate(e`(/ 10 2)`)).toEqual(5)
})
