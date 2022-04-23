import { EnvDefs } from "../parser/visitor.js";
import reporter from "./reporter.js";
import child_process from "child_process";

class ExpressionRunner {
  constructor(
    private readonly globalEnvs = process.env,
    private stageEnvs = process.env
  ) {
    // do nothing
  }

  async exec(commandDef: { type: string; expression: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      if (commandDef.type === "node") {
        reporter.userCommand(`[node] ${commandDef.expression}`);
        const output = String(Function(`return ${commandDef.expression}`)());
        reporter.common(output);
        resolve(output);
      } else {
        let command = "";
        switch (commandDef.type) {
          case "echo":
            command = `echo ${commandDef.expression}`;
            break;
          case "shell":
            command = commandDef.expression;
            break;
          default:
            break;
        }
        reporter.userCommand(command);
        const process = child_process.spawn(command, {
          shell: true,
          env: this.stageEnvs,
        });

        let output = "";

        process.stdout.setEncoding("utf-8");
        process.stdout.on("data", (data: string) => {
          output += data.trim();
          reporter.common(data);
        });

        process.stderr.setEncoding("utf-8");
        process.stderr.on("data", (data: string) => {
          reporter.common(data);
        });

        process.on("close", code => {
          if (code || code === null) {
            reject(code ?? -1);
          } else {
            resolve(output);
          }
        });
      }
    });
  }

  private async genEnv(envDef: EnvDefs[number]) {
    let value = "";
    if (typeof envDef.value === "string") {
      value = envDef.value;
    } else if ("expression" in envDef.value) {
      value = await this.exec(envDef.value);
    }
    return value;
  }

  async setGlobalEnvs(envDefs: EnvDefs) {
    for (const envDef of envDefs) {
      const value = await this.genEnv(envDef);
      this.globalEnvs[envDef.name] = value;
    }
  }

  async setStageEnvs(envDefs: EnvDefs | undefined) {
    this.stageEnvs = Object.assign({}, this.globalEnvs);
    if (Array.isArray(envDefs)) {
      for (const envDef of envDefs) {
        const value = await this.genEnv(envDef);
        this.stageEnvs[envDef.name] = value;
      }
    }
  }
}

const ExprRunner = new ExpressionRunner();

export default ExprRunner;
