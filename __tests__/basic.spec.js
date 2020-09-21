import { ljsp } from './setup'

//
// Basic types
//
test('evaluate number', () => {
  expect(ljsp.evaluate(1)).toEqual(1)
})

test('evaluate string', () => {
  expect(ljsp.evaluate('"hello"')).toEqual('hello')
})
