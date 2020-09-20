import { eva, e } from './tests.setup'

test('evaluate for expression', () => {
  expect(eva.eval(e`
    (for (var x 0)  
         (< x 10)
         (++ x)
         x)
  `)).toEqual(10)
})

test('evaluate for expression w/ dec', () => {
  expect(eva.eval(e`
    (for (var x 10)  
         (> x 0)
         (-- x)
         x)
  `)).toEqual(0)
})
