import { ljsp, e } from './setup'

//
// Block declaration
// (begin <expressions>)
//
test('evaluate block declaration', () => {
  expect(ljsp.evaluate(e`
    (begin
        (var x 10)
        (var y 20)
        (+ (* x y) 30))
    `,
  )).toEqual(230)
})

test('evaluate nested block declaration', () => {
  expect(ljsp.evaluate(
    ['begin',
      ['var', 'x', 10],
      ['begin',
        ['var', 'x', 20],
        'x',
      ],
      'x',
    ],
  )).toEqual(10)
})

test('evaluate nested block with closure', () => {
  expect(ljsp.evaluate(
    ['begin',
      ['var', 'y', 10],
      ['var', 'result', ['begin',
        ['var', 'x', ['+', 'y', 10]],
        'x',
      ]],
      'result',
    ],
  )).toEqual(20)
})
