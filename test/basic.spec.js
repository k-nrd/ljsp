import { eva } from './setup'

//
// Basic types
//
test('evaluate number', () => {
  expect(eva.eval(1)).toEqual(1)
})

test('evaluate string', () => {
  expect(eva.eval('"hello"')).toEqual('hello')
})
