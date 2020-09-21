import { ljsp, e } from './setup'

//
// Lambda expression
//
test('evaluate lambda function', () => {
  expect(ljsp.evaluate(e`
    (begin
        (def onClick (callback)
            (begin
                (var x 10)
                (var y 20)
                (callback (+ x y))))
        (onClick (lambda (data) (* data 10))))
    `,
  )).toEqual(300)
})

test('evaluate IIFE lambda', () => {
  expect(ljsp.evaluate(e`
    ((lambda (data) (* data 10)) 10)
    `,
  )).toEqual(100)
})

test('evaluate var defined as lambda', () => {
  expect(ljsp.evaluate(e`
    (begin
        (var multByTen (lambda (data) (* data 10)))
        (multByTen 5)
    )
    `,
  )).toEqual(50)
})
