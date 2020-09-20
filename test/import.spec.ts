import {eva, e} from './setup'

test('evaluate import', () => {
  expect(eva.run(e`
    (import Math)
    ((prop Math abs) (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(eva.run(e`
    (import Math)
    (var abs (prop Math abs))
    (abs (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(eva.run(e`
    (import Math)
    (prop Math MAX_VALUE)
    `,
  )).toEqual(1000)
})
