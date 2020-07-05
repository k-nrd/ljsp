import Eva from './eva'

const eva = new Eva()

describe('test evaluate number', () => {
  it('should return true', () => {
    expect(eva.eval(1)).toEqual(1)
  })
})

describe('test evaluate string', () => {
  it('should return true', () => {
    expect(eva.eval('hello')).toEqual('hello')
  })
})

describe('test evaluate addition', () => {
  it('should return 5', () => {
    expect(eva.eval(['+', 2, 3])).toEqual(5)
  })
})

describe('test evaluate nested addition', () => {
  it('should return 8', () => {
    expect(eva.eval(['+', ['+', 1, 2], 5])).toEqual(8)
  })
})
