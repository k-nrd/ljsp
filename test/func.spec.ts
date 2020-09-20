import { eva, e } from './setup'

//
// Function declaration
//
test('evaluate user defined function', () => {
  expect(eva.eval(e`
    (begin
        (def square (x)
            (* x x))
        (square 3))
    `,
  )).toEqual(9)
})

test('evaluate user defined function with inner block', () => {
  expect(eva.eval(e`
    (begin
        (def timesTen (x)
          (begin 
            (var z 10)
            (* x z)))
        (timesTen 5))
    `,
  )).toEqual(50)
})

test('evaluate user defined function with closure', () => {
  expect(eva.eval(e`
    (begin
        (var z 20)
        (def timesTwenty (x)
            (* x z))
        (timesTwenty 2))
    `,
  )).toEqual(40)
})

test('evaluate user defined function returns closure', () => {
  expect(eva.eval(e`
    (begin
        (var val 100)
        (def calc (x y)
            (begin
                (var z (+ x y))
                (def inner (foo)
                    (+ (+ foo z) val))
                inner))
        (var fn (calc 10 20))
        (fn 30))
    `,
  )).toEqual(160)
})

test('evaluate recursive functions', () => {
  expect(eva.eval(e`
    (begin
        (def factorial (x)
            (if (== x 1)
                1
                (* x (factorial (- x 1)))))
        (factorial 5)
    )
    `,
  )).toEqual(120)
})
