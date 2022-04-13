import { CstParser, IToken } from "chevrotain";
import {
  tokens,
  ParenLeft,
  Str,
  ParenRight,
  Identifier,
  Equal,
  CurlyLeft,
  CurlyRight,
  StageName,
  KeywordStages,
  KeywordNode,
  KeywordShell,
  KeywordEnv,
  InquirerInput,
  InquirerConfirm,
  InquirerRawList,
  Comma,
  SquareLeft,
  SquareRight,
  InquirerCheckbox,
  Num,
  KeywordSelectBranch,
  KeywordEcho,
} from "./lexer.js";

class Parser extends CstParser {
  private string = this.RULE("string", () => this.CONSUME(Str));
  private number = this.RULE("number", () => this.CONSUME(Num));

  private array = this.RULE("array", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME1(SquareLeft);
          this.SUBRULE1(this.number);
          this.MANY1(() => {
            this.CONSUME1(Comma);
            this.SUBRULE2(this.number);
          });
          this.CONSUME1(SquareRight);
        },
      },
      {
        ALT: () => {
          this.CONSUME2(SquareLeft);
          this.SUBRULE1(this.string);
          this.MANY2(() => {
            this.CONSUME2(Comma);
            this.SUBRULE2(this.string);
          });
          this.CONSUME2(SquareRight);
        },
      },
    ]);
  });

  private nodeStat = this.RULE("nodeStat", () => {
    this.CONSUME(KeywordNode);
    this.SUBRULE(this.string);
  });

  private echoStat = this.RULE("echoStat", () => {
    this.CONSUME(KeywordEcho);
    this.SUBRULE(this.string);
  });

  private shellStat = this.RULE("shellStat", () => {
    this.CONSUME(KeywordShell);
    this.SUBRULE(this.string);
  });

  private inputStat = this.RULE("inputStat", () => {
    this.CONSUME(InquirerInput);
    this.CONSUME(ParenLeft);
    this.SUBRULE(this.string);
    this.CONSUME(ParenRight);
  });

  private confirmStat = this.RULE("confirmStat", () => {
    this.CONSUME(InquirerConfirm);
    this.CONSUME(ParenLeft);
    this.SUBRULE(this.string);
    this.CONSUME(ParenRight);
  });

  private rawListStat = this.RULE("rawListStat", () => {
    this.CONSUME(InquirerRawList);
    this.CONSUME(ParenLeft);
    this.SUBRULE(this.string);
    this.CONSUME(Comma);
    this.SUBRULE(this.array);
    this.CONSUME(ParenRight);
  });

  private checkboxStat = this.RULE("checkboxStat", () => {
    this.CONSUME(InquirerCheckbox);
    this.CONSUME(ParenLeft);
    this.SUBRULE(this.string);
    this.CONSUME(Comma);
    this.SUBRULE(this.array);
    this.CONSUME(ParenRight);
  });

  private selectBranchStat = this.RULE("selectBranchStat", () => {
    this.CONSUME(KeywordSelectBranch);
    this.CONSUME(ParenLeft);
    this.SUBRULE1(this.string);
    this.OPTION(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.string);
    });
    this.CONSUME(ParenRight);
  });

  private noneVoidStat = this.RULE("noneVoidStat", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.nodeStat) },
      { ALT: () => this.SUBRULE(this.echoStat) },
      { ALT: () => this.SUBRULE(this.shellStat) },
      { ALT: () => this.SUBRULE(this.inputStat) },
      { ALT: () => this.SUBRULE(this.confirmStat) },
      { ALT: () => this.SUBRULE(this.rawListStat) },
      { ALT: () => this.SUBRULE(this.checkboxStat) },
      { ALT: () => this.SUBRULE(this.selectBranchStat) },
    ]);
  });

  private expression = this.RULE("expression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.string) },
      { ALT: () => this.SUBRULE(this.noneVoidStat) },
    ]);
  });

  private defStat = this.RULE("defStat", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Equal);
    this.SUBRULE(this.expression);
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.defStat) },
      { ALT: () => this.SUBRULE(this.noneVoidStat) },
    ]);
  });

  private envStage = this.RULE("envStage", () => {
    this.CONSUME(KeywordEnv);
    this.CONSUME(CurlyLeft);
    this.MANY(() => {
      this.SUBRULE(this.defStat);
    });
    this.CONSUME(CurlyRight);
  });

  private commonStage = this.RULE("commonStage", () => {
    this.CONSUME(StageName);
    this.CONSUME(CurlyLeft);
    this.OPTION(() => {
      this.SUBRULE(this.envStage);
    });
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
    this.CONSUME(CurlyRight);
  });

  private stages = this.RULE("stages", () => {
    this.CONSUME(KeywordStages);
    this.CONSUME(CurlyLeft);
    this.OPTION(() => {
      this.SUBRULE(this.envStage);
    });
    this.MANY(() => {
      this.SUBRULE(this.commonStage);
    });
    this.CONSUME(CurlyRight);
  });

  constructor() {
    super(tokens);

    this.performSelfAnalysis();
  }

  parse(lexedTokens: IToken[]) {
    this.input = lexedTokens;
    return this.stages();
  }
}

const parser = new Parser();

export default parser;
