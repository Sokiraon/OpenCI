/// <reference types="node" />
import { EnvDefs } from "../parser/visitor.js";
declare class ExpressionRunner {
    private readonly globalEnvs;
    private stageEnvs;
    constructor(globalEnvs?: NodeJS.ProcessEnv, stageEnvs?: NodeJS.ProcessEnv);
    exec(commandDef: {
        type: string;
        expression: string;
    }): Promise<string>;
    private genEnv;
    setGlobalEnvs(envDefs: EnvDefs): Promise<void>;
    setStageEnvs(envDefs: EnvDefs | undefined): Promise<void>;
}
declare const ExprRunner: ExpressionRunner;
export default ExprRunner;
