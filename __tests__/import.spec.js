import {ljsp, e} from './setup'

test('evaluate import', () => {
  expect(ljsp.run(e`
    (import Math)
    ((prop Math abs) (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(ljsp.run(e`
    (import Math)
    (var abs (prop Math abs))
    (abs (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(ljsp.run(e`
    (import Math)
    (prop Math MAX_VALUE)
    `,
  )).toEqual(1000)
})
