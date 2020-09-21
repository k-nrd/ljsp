import { ljsp, e } from './setup'

test('evaluate switch expression', () => {
  expect(ljsp.run(e`
    (var x 10)
    (switch ((== x 10) 100)
            ((> x 10) 200)
            (else 300))
  `)).toEqual(100)
})
