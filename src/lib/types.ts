type Expression = number | string | boolean | List
type EvaString = string

type List = Expression[]

interface NumOpExpression extends List {
  0: NumOp
  [index: number]: Expression
}

interface CompExpression extends List {
  0: CompOp
  1: Expression
  2: Expression
}

interface VarExpression extends List {
  0: 'var'
  1: string
  2: Expression
}

interface BlockExpression extends List {
  0: 'begin'
  [index: number]: Expression
}

interface AssignExpression extends List {
  0: 'set'
  1: string
  2: Expression
}

interface IfExpression extends List {
  0: 'if'
  1: BoolExpression
  2: Expression
  3: Expression
}

interface IfExpression extends List {
  0: 'while'
  1: BoolExpression
  2: BlockExpression
}

type BoolExpression = CompExpression

type NumOp = '+' | '*' | '-' | '/'
type CompOp = '<' | '>' | '<=' | '>=' | '==' | '!='

type VarName = string

export {
  Expression,
  EvaString,
  List,
  NumOpExpression,
  VarExpression,
  NumOp,
  CompOp,
  VarName,
  BlockExpression,
  AssignExpression,
  IfExpression,
  BoolExpression,
  CompExpression,
  WhileExpression,
}
