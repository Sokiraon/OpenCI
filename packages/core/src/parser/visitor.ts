import parser from "./parser.js";
import {
  ArrayCstChildren,
  CheckboxStatCstChildren,
  CommonStageCstChildren,
  ConfirmStatCstChildren,
  DefStatCstChildren,
  EchoStatCstChildren,
  EnvStageCstChildren,
  ExpressionCstChildren,
  ICstNodeVisitor,
  InputStatCstChildren,
  NodeStatCstChildren,
  NonBlockStatCstChildren,
  NonVoidStatCstChildren,
  NumberCstChildren,
  RawListStatCstChildren,
  SelectBranchStatCstChildren,
  ShellStatCstChildren,
  StagesCstChildren,
  StringCstChildren,
  UserInputStatCstChildren,
} from "./type.js";

class Visitor
  extends parser.getBaseCstVisitorConstructor()
  implements ICstNodeVisitor<any, any>
{
  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * @returns trimmed string, with the starting and ending quotes removed
   */
  string(children: StringCstChildren) {
    return children.String[0].image.slice(1, -1);
  }

  number(children: NumberCstChildren) {
    return Number(children.Number[0].image);
  }

  array(children: ArrayCstChildren) {
    if (Array.isArray(children.string)) {
      return children.string.map(item => this.string(item.children));
    } else if (Array.isArray(children.number)) {
      return children.number.map(item => this.number(item.children));
    }
    return [];
  }

  nodeStat(children: NodeStatCstChildren): { type: "node"; expression: string } {
    return {
      type: "node",
      expression: this.string(children.string[0].children),
    };
  }

  echoStat(children: EchoStatCstChildren): { type: "echo"; expression: string } {
    return {
      type: "echo",
      expression: this.string(children.string[0].children),
    };
  }

  shellStat(children: ShellStatCstChildren): { type: "shell"; expression: string } {
    return {
      type: "shell",
      expression: this.string(children.string[0].children),
    };
  }

  nonBlockStat(children: NonBlockStatCstChildren): VisitNonBlockStatResult {
    if (children.echoStat) {
      return this.echoStat(children.echoStat[0].children);
    } else if (children.nodeStat) {
      return this.nodeStat(children.nodeStat[0].children);
    } else if (children.shellStat) {
      return this.shellStat(children.shellStat[0].children);
    } else {
      return { type: "shell", expression: "" };
    }
  }

  inputStat(children: InputStatCstChildren) {
    return {
      type: "input",
      message: this.string(children.string[0].children),
    };
  }

  confirmStat(children: ConfirmStatCstChildren) {
    return {
      type: "confirm",
      message: this.string(children.string[0].children),
    };
  }

  rawListStat(children: RawListStatCstChildren) {
    return {
      type: "rawlist",
      message: this.string(children.string[0].children),
      choices: this.array(children.array[0].children),
    };
  }

  checkboxStat(children: CheckboxStatCstChildren) {
    return {
      type: "checkbox",
      message: this.string(children.string[0].children),
      choices: this.array(children.array[0].children),
    };
  }

  selectBranchStat(children: SelectBranchStatCstChildren) {
    return {
      type: "selectBranch",
      message: this.string(children.string[0].children),
      remote: this.string(children.string[1].children),
    };
  }

  userInputStat(children: UserInputStatCstChildren) {
    if (children.inputStat) {
      return this.inputStat(children.inputStat[0].children);
    } else if (children.confirmStat) {
      return this.confirmStat(children.confirmStat[0].children);
    } else if (children.rawListStat) {
      return this.rawListStat(children.rawListStat[0].children);
    } else if (children.checkboxStat) {
      return this.checkboxStat(children.checkboxStat[0].children);
    } else if (children.selectBranchStat) {
      return this.selectBranchStat(children.selectBranchStat[0].children);
    } else {
      return { type: "input", expression: "" };
    }
  }

  nonVoidStat(children: NonVoidStatCstChildren) {
    if (children.nonBlockStat) {
      return this.nonBlockStat(children.nonBlockStat[0].children);
    } else {
      return this.userInputStat(children.userInputStat![0].children);
    }
  }

  expression(children: ExpressionCstChildren) {
    if (children.string) {
      return this.string(children.string[0].children);
    } else {
      return this.nonVoidStat(children.nonVoidStat![0].children);
    }
  }

  defStat(children: DefStatCstChildren) {
    return {
      name: children.Identifier[0].image,
      value: this.expression(children.expression[0].children),
    };
  }

  envStage(children: EnvStageCstChildren) {
    let statements: ReturnType<typeof this.defStat>[] = [];
    if (children.defStat) {
      statements = children.defStat.map(item => this.defStat(item.children));
    }
    return statements;
  }

  commonStage(children: CommonStageCstChildren) {
    const res: VisitCommonStageResult = {
      name: children.StageName[0].image,
      steps: [],
    };
    if (Array.isArray(children.nonBlockStat)) {
      res.steps = children.nonBlockStat.map(item =>
        this.nonBlockStat(item.children)
      );
    }
    if (children.envStage) {
      res.env = this.envStage(children.envStage[0].children);
    }
    return res;
  }

  stages(children: StagesCstChildren) {
    const res: VisitStagesResult = { stages: [] };
    if (children.envStage) {
      res.env = this.envStage(children.envStage[0].children);
    }
    if (Array.isArray(children.commonStage)) {
      res.stages = children.commonStage.map(stage =>
        this.commonStage(stage.children)
      );
    }
    return res;
  }
}

export type EnvDefs = ReturnType<typeof visitor.envStage>;

export interface VisitNonBlockStatResult {
  type: "echo" | "node" | "shell";
  expression: string;
}

export interface VisitCommonStageResult {
  name: string;
  steps: ReturnType<typeof visitor.nonBlockStat>[];
  env?: EnvDefs;
}

export interface VisitStagesResult {
  env?: EnvDefs;
  stages: Array<VisitCommonStageResult>;
}

const visitor = new Visitor();

export default visitor;
