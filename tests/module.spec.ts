import { eva, e } from './tests.setup'

test('evaluate module', () => {
  expect(eva.run(e`
    (module Math
        (begin
            (def abs x
                (if (< value 0)
                    (- value)
                    value))

            (def square x
                (* x x))

            (var MAX_VALUE 1000))))
    ((prop Math abs) (- 10))
    `,
  )).toEqual(10)
})
