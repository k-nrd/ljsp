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

interface VarDeclaration extends List {
  0: 'var'
  1: string
  2: Expression
}

interface BlockDeclaration extends List {
  0: 'begin'
  [index: number]: Expression
}

interface AssignDeclaration extends List {
  0: 'set'
  1: string
  2: Expression
}

interface IfDeclaration extends List {
  0: 'if'
  1: BoolExpression
  2: Expression
  3: Expression
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
  VarDeclaration,
  NumOp,
  CompOp,
  VarName,
  BlockDeclaration,
  AssignDeclaration,
  IfDeclaration,
  BoolExpression,
  CompExpression,
}
