import { ljsp, e } from './setup'

//
// If block
// (if <cond>
//     <consequent>
//     <alternate>)
//
test('evaluate if block', () => {
  expect(ljsp.evaluate(
    ['begin',
      ['var', 'x', 10],
      ['var', 'y', 0],
      ['if',
        ['>', 'x', 10],
        ['set', 'y', 20],
        ['set', 'y', 30],
      ],
      'y',
    ],
  )).toEqual(30)
})

//
// While block
// (while <cond>
//        <block>)
//
test('evaluate while block', () => {
  expect(ljsp.evaluate(
    ['begin',
      ['var', 'counter', 0],
      ['while',
        ['<', 'counter', 10],
        ['begin',
          ['set', 'counter', ['+', 'counter', 1]],
        ],
      ],
      'counter',
    ],
  )).toEqual(10)
})

//
// Tagged literal parsing
//
test('evaluate tagged S-expression literal', () => {
  expect(ljsp.evaluate(e`
      (begin 
          (var counter 0)
          (while (< counter 15)
              (begin 
                  (set counter (+ counter 1))))
          counter)
      `)).toEqual(15)
})
