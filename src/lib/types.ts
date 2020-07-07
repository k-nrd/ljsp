type Expression = number | string | boolean | function | List
type EvaString = string

type List = Expression[]

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

interface WhileExpression extends List {
  0: 'while'
  1: Expression
  2: BlockExpression
}

interface FunctionCall extends List {
  0: VarName
  [index: number]: Expression
}

type VarName = string

export {
  Expression,
  EvaString,
  List,
  VarExpression,
  VarName,
  BlockExpression,
  AssignExpression,
  IfExpression,
  WhileExpression,
  FunctionCall,
}
