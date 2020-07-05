import Eva from './index'
import Env from './env'

const eva = new Eva(new Env({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
}))

//
// Basic types
//
describe('evaluate number', () => {
  it('should return true', () => {
    expect(eva.eval(1)).toEqual(1)
  })
})

describe('evaluate string', () => {
  it('should return true', () => {
    expect(eva.eval('"hello"')).toEqual('hello')
  })
})

//
// Math ops
// (+ <number> <number>)
//
describe('evaluate addition', () => {
  it('should return 5', () => {
    expect(eva.eval(['+', 2, 3])).toEqual(5)
  })
})

describe('evaluate nested addition', () => {
  it('should return 8', () => {
    expect(eva.eval(['+', ['+', 1, 2], 5])).toEqual(8)
  })
})

describe('evaluate subtraction', () => {
  it('should return 1', () => {
    expect(eva.eval(['-', 3, 2])).toEqual(1)
  })
})

describe('evaluate multiplication', () => {
  it('should return 10', () => {
    expect(eva.eval(['*', 2, 5])).toEqual(10)
  })
})

describe('evaluate division', () => {
  it('should return 2', () => {
    expect(eva.eval(['/', 10, 2])).toEqual(5)
  })
})

//
// Variable declaration and lookup
// (var x <value>)
// (x)
//
describe('evaluate variable declaration', () => {
  it('should return 10', () => {
    expect(eva.eval(['var', 'x', 10])).toEqual(10)
  })
})

describe('evaluate variable lookup', () => {
  it('should return 10', () => {
    expect(eva.eval('x')).toEqual(10)
  })
})

describe('evaluate variable declaration (string)', () => {
  it('should return \'Hello, Eva!\'', () => {
    expect(eva.eval(['var', 'y', '"Hello, Eva!"'])).toEqual('Hello, Eva!')
  })
})

describe('evaluate builtin variable null', () => {
  it('should return null', () => {
    expect(eva.eval('null')).toBeNull()
  })
})

describe('evaluate builtin variable true', () => {
  it('should return true', () => {
    expect(eva.eval('true')).toEqual(true)
  })
})

describe('evaluate builtin variable false', () => {
  it('should return false', () => {
    expect(eva.eval('false')).toEqual(false)
  })
})

describe('evaluate builtin variable VERSION', () => {
  it('should return \'0.1\'', () => {
    expect(eva.eval('VERSION')).toEqual('0.1')
  })
})

describe('evaluate nested var declaration', () => {
  it('should return 7', () => {
    expect(eva.eval(['var', 'z', ['+', 3, 4]])).toEqual(7)
  })
})

//
// Block declaration
// (begin <expressions>)
//
describe('evaluate block declaration', () => {
  it('should return 230', () => {
    expect(eva.eval(
      ['begin',
        ['var', 'x', 10],
        ['var', 'y', 20],
        ['+', ['*', 'x', 'y'], 30],
      ],
    )).toEqual(230)
  })
})

describe('evaluate nested block declaration', () => {
  it('should return 10', () => {
    expect(eva.eval(
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
})

describe('evaluate nested block with closure', () => {
  it('should return 20', () => {
    expect(eva.eval(
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
})

//
// Assignment declaration
// (set x <value>)
//
describe('evaluate assign declaration', () => {
  it('should return 20', () => {
    expect(eva.eval(
      ['begin',
        ['var', 'x', 10],
        ['begin',
          ['set', 'x', 100],
        ],
        'x',
      ],
    )).toEqual(100)
  })
})

//
// If block
// (if <cond>
//     <consequent>
//     <alternate>)
//
describe('evaluate if block', () => {
  it('should return 30', () => {
    expect(eva.eval(
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
})
