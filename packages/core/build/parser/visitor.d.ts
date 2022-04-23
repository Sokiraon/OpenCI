import { ArrayCstChildren, CheckboxStatCstChildren, CommonStageCstChildren, ConfirmStatCstChildren, DefStatCstChildren, EchoStatCstChildren, EnvStageCstChildren, ExpressionCstChildren, ICstNodeVisitor, InputStatCstChildren, NodeStatCstChildren, NonBlockStatCstChildren, NonVoidStatCstChildren, NumberCstChildren, RawListStatCstChildren, SelectBranchStatCstChildren, ShellStatCstChildren, StagesCstChildren, StringCstChildren, UserInputStatCstChildren } from "./type.js";
declare const Visitor_base: new (...args: any[]) => import("chevrotain").ICstVisitor<any, any>;
declare class Visitor extends Visitor_base implements ICstNodeVisitor<any, any> {
    constructor();
    string(children: StringCstChildren): string;
    number(children: NumberCstChildren): number;
    array(children: ArrayCstChildren): number[] | string[];
    nodeStat(children: NodeStatCstChildren): {
        type: "node";
        expression: string;
    };
    echoStat(children: EchoStatCstChildren): {
        type: "echo";
        expression: string;
    };
    shellStat(children: ShellStatCstChildren): {
        type: "shell";
        expression: string;
    };
    nonBlockStat(children: NonBlockStatCstChildren): VisitNonBlockStatResult;
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
        choices: number[] | string[];
    };
    checkboxStat(children: CheckboxStatCstChildren): {
        type: string;
        message: string;
        choices: number[] | string[];
    };
    selectBranchStat(children: SelectBranchStatCstChildren): {
        type: string;
        message: string;
        remote: string;
    };
    userInputStat(children: UserInputStatCstChildren): {
        type: string;
        message: string;
    } | {
        type: string;
        expression: string;
    };
    nonVoidStat(children: NonVoidStatCstChildren): {
        type: string;
        message: string;
    } | {
        type: string;
        expression: string;
    };
    expression(children: ExpressionCstChildren): string | {
        type: string;
        message: string;
    } | {
        type: string;
        expression: string;
    };
    defStat(children: DefStatCstChildren): {
        name: string;
        value: string | {
            type: string;
            message: string;
        } | {
            type: string;
            expression: string;
        };
    };
    envStage(children: EnvStageCstChildren): {
        name: string;
        value: string | {
            type: string;
            message: string;
        } | {
            type: string;
            expression: string;
        };
    }[];
    commonStage(children: CommonStageCstChildren): VisitCommonStageResult;
    stages(children: StagesCstChildren): VisitStagesResult;
}
export declare type EnvDefs = ReturnType<typeof visitor.envStage>;
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
declare const visitor: Visitor;
export default visitor;
