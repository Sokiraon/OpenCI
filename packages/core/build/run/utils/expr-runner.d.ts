/// <reference types="node" />
import { EnvDefs } from "../../parser/visitor.js";
import MessageStream from "./message-stream.js";
export default class ExpressionRunner {
    private readonly globalEnvs;
    private stageEnvs;
    private messageStream;
    constructor(initialEnvs: NodeJS.ProcessEnv, messageStream: MessageStream.Duplex);
    exec(commandDef: {
        type: string;
        expression: string;
    }): Promise<string>;
    private genEnv;
    setGlobalEnvs(envDefs: EnvDefs): Promise<void>;
    setStageEnvs(envDefs: EnvDefs | undefined): Promise<void>;
}
