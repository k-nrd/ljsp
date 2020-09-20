import { eva, e } from './setup'

//
// Lambda expression
//
test('evaluate lambda function', () => {
  expect(eva.eval(e`
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
  expect(eva.eval(e`
    ((lambda (data) (* data 10)) 10)
    `,
  )).toEqual(100)
})

test('evaluate var defined as lambda', () => {
  expect(eva.eval(e`
    (begin
        (var multByTen (lambda (data) (* data 10)))
        (multByTen 5)
    )
    `,
  )).toEqual(50)
})
