import { ArrayCstChildren, CheckboxStatCstChildren, CommonStageCstChildren, ConfirmStatCstChildren, DefStatCstChildren, EchoStatCstChildren, EnvStageCstChildren, ExpressionCstChildren, ICstNodeVisitor, InputStatCstChildren, NodeStatCstChildren, NoneVoidStatCstChildren, NumberCstChildren, RawListStatCstChildren, SelectBranchStatCstChildren, ShellStatCstChildren, StagesCstChildren, StatementCstChildren, StringCstChildren } from "./type.js";
declare const Visitor_base: new (...args: any[]) => import("chevrotain").ICstVisitor<any, any>;
declare class Visitor extends Visitor_base implements ICstNodeVisitor<any, any> {
    constructor();
    string(children: StringCstChildren): string;
    number(children: NumberCstChildren): number;
    array(children: ArrayCstChildren): string[] | number[];
    nodeStat(children: NodeStatCstChildren): {
        type: "node";
        expression: string;
    };
    echoStat(children: EchoStatCstChildren): {
        type: string;
        expression: string;
    };
    shellStat(children: ShellStatCstChildren): {
        type: string;
        expression: string;
    };
    inputStat(children: InputStatCstChildren): {
        type: string;
        message: string;
    };
    confirmStat(children: ConfirmStatCstChildren): {
        type: string;
        message: string;
    };
    rawListStat(children: RawListStatCstChildren): {
        type: string;
        message: string;
        choices: string[] | number[];
    };
    checkboxStat(children: CheckboxStatCstChildren): {
        type: string;
        message: string;
        choices: string[] | number[];
    };
    selectBranchStat(children: SelectBranchStatCstChildren): {
        type: string;
        message: string;
        remote: string;
    };
    noneVoidStat(children: NoneVoidStatCstChildren): {
        type: string;
        expression: string;
    } | {
        type: string;
        message: string;
    };
    expression(children: ExpressionCstChildren): string | {
        type: string;
        expression: string;
    } | {
        type: string;
        message: string;
    };
    defStat(children: DefStatCstChildren): {
        name: string;
        value: string | {
            type: string;
            expression: string;
        } | {
            type: string;
            message: string;
        };
    };
    statement(children: StatementCstChildren): {
        type: string;
        expression: string;
    } | {
        type: string;
        message: string;
    } | {
        name: string;
        value: string | {
            type: string;
            expression: string;
        } | {
            type: string;
            message: string;
        };
    };
    envStage(children: EnvStageCstChildren): {
        name: string;
        value: string | {
            type: string;
            expression: string;
        } | {
            type: string;
            message: string;
        };
    }[];
    commonStage(children: CommonStageCstChildren): VisitCommonStageResult;
    stages(children: StagesCstChildren): VisitStagesResult;
}
interface VisitCommonStageResult {
    name: string;
    steps: ReturnType<typeof visitor.statement>[];
    env?: ReturnType<typeof visitor.envStage>;
}
export interface VisitStagesResult {
    env?: ReturnType<typeof visitor.envStage>;
    stages: Array<VisitCommonStageResult>;
}
declare const visitor: Visitor;
export default visitor;
