import {ljsp, e} from './setup'

test('evaluate module', () => {
  expect(ljsp.run(e`
    (module Math
        (begin
            (def abs x
                (if (< x 0)
                    (- x)
                    x))

            (def square x
                (* x x))

            (var MAX_VALUE 1000)))
    ((prop Math abs) (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(ljsp.run(e`
    (module Math
        (begin
            (def abs x
                (if (< x 0)
                    (- x)
                    x))

            (def square x
                (* x x))

            (var MAX_VALUE 1000)))
    (var abs (prop Math abs))
    (abs (- 10))
    `,
  )).toEqual(10)
})

test('assign module function to a var', () => {
  expect(ljsp.run(e`
    (module Math
        (begin
            (def abs x
                (if (< x 0)
                    (- x)
                    x))

            (def square x
                (* x x))

            (var MAX_VALUE 1000)))
    (prop Math MAX_VALUE)
    `,
  )).toEqual(1000)
})
