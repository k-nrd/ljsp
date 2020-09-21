import {ljsp, e} from './setup'

//
// Variable declaration and lookup
// (var x <value>)
// (x)
//
test('evaluate variable declaration', () => {
  expect(ljsp.run(e`(var x 10)`)).toEqual(10)
})

test('evaluate variable declaration (string)', () => {
  expect(ljsp.run(['var', 'y', '"Hello, Eva!"'])).toEqual('Hello, Eva!')
})

test('evaluate builtin variable null', () => {
  expect(ljsp.run('null')).toBeNull()
})

test('evaluate builtin variable true', () => {
  expect(ljsp.run('true')).toEqual(true)
})

test('evaluate builtin variable false', () => {
  expect(ljsp.run('false')).toEqual(false)
})

test('evaluate builtin variable VERSION', () => {
  expect(ljsp.run('VERSION')).toEqual('0.1')
})

test('evaluate nested var declaration', () => {
  expect(ljsp.run(['var', 'z', ['+', 3, 4]])).toEqual(7)
})

//
// Assignment declaration
// (set x <value>)
//
test('evaluate assign declaration', () => {
  expect(ljsp.run(e`
      (var x 10)
      (begin
          (set x 100))
      x
  `,
  )).toEqual(100)
})
