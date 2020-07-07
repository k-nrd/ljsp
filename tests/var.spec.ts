import { eva, e } from './tests.setup'

//
// Variable declaration and lookup
// (var x <value>)
// (x)
//
test('evaluate variable declaration', () => {
  expect(eva.eval(e`(var x 10)`)).toEqual(10)
})

test('evaluate variable lookup', () => {
  expect(eva.eval('x')).toEqual(10)
})

test('evaluate variable declaration (string)', () => {
  expect(eva.eval(['var', 'y', '"Hello, Eva!"'])).toEqual('Hello, Eva!')
})

test('evaluate builtin variable null', () => {
  expect(eva.eval('null')).toBeNull()
})

test('evaluate builtin variable true', () => {
  expect(eva.eval('true')).toEqual(true)
})

test('evaluate builtin variable false', () => {
  expect(eva.eval('false')).toEqual(false)
})

test('evaluate builtin variable VERSION', () => {
  expect(eva.eval('VERSION')).toEqual('0.1')
})

test('evaluate nested var declaration', () => {
  expect(eva.eval(['var', 'z', ['+', 3, 4]])).toEqual(7)
})

//
// Assignment declaration
// (set x <value>)
//
test('evaluate assign declaration', () => {
  expect(eva.eval(e`
  (begin
      (var x 10)
      (begin
          (set x 100))
      x)
  `,
  )).toEqual(100)
})
