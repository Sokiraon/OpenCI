import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface StringCstNode extends CstNode {
  name: "string";
  children: StringCstChildren;
}

export type StringCstChildren = {
  String: IToken[];
};

export interface NumberCstNode extends CstNode {
  name: "number";
  children: NumberCstChildren;
}

export type NumberCstChildren = {
  Number: IToken[];
};

export interface ArrayCstNode extends CstNode {
  name: "array";
  children: ArrayCstChildren;
}

export type ArrayCstChildren = {
  SquareLeft?: IToken[];
  number?: NumberCstNode[];
  Comma?: IToken[];
  SquareRight?: IToken[];
  string?: StringCstNode[];
};

export interface NodeStatCstNode extends CstNode {
  name: "nodeStat";
  children: NodeStatCstChildren;
}

export type NodeStatCstChildren = {
  Node: IToken[];
  string: StringCstNode[];
};

export interface EchoStatCstNode extends CstNode {
  name: "echoStat";
  children: EchoStatCstChildren;
}

export type EchoStatCstChildren = {
  Echo: IToken[];
  string: StringCstNode[];
};

export interface ShellStatCstNode extends CstNode {
  name: "shellStat";
  children: ShellStatCstChildren;
}

export type ShellStatCstChildren = {
  Shell: IToken[];
  string: StringCstNode[];
};

export interface InputStatCstNode extends CstNode {
  name: "inputStat";
  children: InputStatCstChildren;
}

export type InputStatCstChildren = {
  Input: IToken[];
  ParenLeft: IToken[];
  string: StringCstNode[];
  ParenRight: IToken[];
};

export interface ConfirmStatCstNode extends CstNode {
  name: "confirmStat";
  children: ConfirmStatCstChildren;
}

export type ConfirmStatCstChildren = {
  Confirm: IToken[];
  ParenLeft: IToken[];
  string: StringCstNode[];
  ParenRight: IToken[];
};

export interface RawListStatCstNode extends CstNode {
  name: "rawListStat";
  children: RawListStatCstChildren;
}

export type RawListStatCstChildren = {
  RawList: IToken[];
  ParenLeft: IToken[];
  string: StringCstNode[];
  Comma: IToken[];
  array: ArrayCstNode[];
  ParenRight: IToken[];
};

export interface CheckboxStatCstNode extends CstNode {
  name: "checkboxStat";
  children: CheckboxStatCstChildren;
}

export type CheckboxStatCstChildren = {
  Checkbox: IToken[];
  ParenLeft: IToken[];
  string: StringCstNode[];
  Comma: IToken[];
  array: ArrayCstNode[];
  ParenRight: IToken[];
};

export interface SelectBranchStatCstNode extends CstNode {
  name: "selectBranchStat";
  children: SelectBranchStatCstChildren;
}

export type SelectBranchStatCstChildren = {
  SelectBranch: IToken[];
  ParenLeft: IToken[];
  string: StringCstNode[];
  Comma?: IToken[];
  ParenRight: IToken[];
};

export interface NoneVoidStatCstNode extends CstNode {
  name: "noneVoidStat";
  children: NoneVoidStatCstChildren;
}

export type NoneVoidStatCstChildren = {
  nodeStat?: NodeStatCstNode[];
  echoStat?: EchoStatCstNode[];
  shellStat?: ShellStatCstNode[];
  inputStat?: InputStatCstNode[];
  confirmStat?: ConfirmStatCstNode[];
  rawListStat?: RawListStatCstNode[];
  checkboxStat?: CheckboxStatCstNode[];
  selectBranchStat?: SelectBranchStatCstNode[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  string?: StringCstNode[];
  noneVoidStat?: NoneVoidStatCstNode[];
};

export interface DefStatCstNode extends CstNode {
  name: "defStat";
  children: DefStatCstChildren;
}

export type DefStatCstChildren = {
  Identifier: IToken[];
  Equal: IToken[];
  expression: ExpressionCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  defStat?: DefStatCstNode[];
  noneVoidStat?: NoneVoidStatCstNode[];
};

export interface EnvStageCstNode extends CstNode {
  name: "envStage";
  children: EnvStageCstChildren;
}

export type EnvStageCstChildren = {
  Env: IToken[];
  CurlyLeft: IToken[];
  defStat?: DefStatCstNode[];
  CurlyRight: IToken[];
};

export interface CommonStageCstNode extends CstNode {
  name: "commonStage";
  children: CommonStageCstChildren;
}

export type CommonStageCstChildren = {
  StageName: IToken[];
  CurlyLeft: IToken[];
  envStage?: EnvStageCstNode[];
  statement?: StatementCstNode[];
  CurlyRight: IToken[];
};

export interface StagesCstNode extends CstNode {
  name: "stages";
  children: StagesCstChildren;
}

export type StagesCstChildren = {
  Stages: IToken[];
  CurlyLeft: IToken[];
  envStage?: EnvStageCstNode[];
  commonStage?: CommonStageCstNode[];
  CurlyRight: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  string(children: StringCstChildren, param?: IN): OUT;
  number(children: NumberCstChildren, param?: IN): OUT;
  array(children: ArrayCstChildren, param?: IN): OUT;
  nodeStat(children: NodeStatCstChildren, param?: IN): OUT;
  echoStat(children: EchoStatCstChildren, param?: IN): OUT;
  shellStat(children: ShellStatCstChildren, param?: IN): OUT;
  inputStat(children: InputStatCstChildren, param?: IN): OUT;
  confirmStat(children: ConfirmStatCstChildren, param?: IN): OUT;
  rawListStat(children: RawListStatCstChildren, param?: IN): OUT;
  checkboxStat(children: CheckboxStatCstChildren, param?: IN): OUT;
  selectBranchStat(children: SelectBranchStatCstChildren, param?: IN): OUT;
  noneVoidStat(children: NoneVoidStatCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
  defStat(children: DefStatCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  envStage(children: EnvStageCstChildren, param?: IN): OUT;
  commonStage(children: CommonStageCstChildren, param?: IN): OUT;
  stages(children: StagesCstChildren, param?: IN): OUT;
}
