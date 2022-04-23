import { CstParser, IToken } from "chevrotain";
declare class Parser extends CstParser {
    private string;
    private number;
    private array;
    private nodeStat;
    private echoStat;
    private shellStat;
    private inputStat;
    private confirmStat;
    private rawListStat;
    private checkboxStat;
    private selectBranchStat;
    private nonBlockStat;
    private userInputStat;
    private nonVoidStat;
    private expression;
    private defStat;
    private envStage;
    private commonStage;
    private stages;
    constructor();
    parse(lexedTokens: IToken[]): import("chevrotain").CstNode;
}
declare const parser: Parser;
export default parser;
