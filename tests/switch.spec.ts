import { eva, e } from './tests.setup'

test('evaluate switch expression', () => {
  expect(eva.eval(e`
    (begin
        (var x 10)
        (switch ((== x 10) 100)
                ((> x 10) 200)
                (else 300)))
  `)).toEqual(100)
})
