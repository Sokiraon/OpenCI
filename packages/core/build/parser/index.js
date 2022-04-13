import { readFileSync } from "fs";
import lexer from "./lexer";
import parser from "./parser";
import visitor from "./visitor";
export default function parseCIFile(filePath) {
    try {
        const content = readFileSync(filePath, "utf-8");
        const lexResult = lexer.tokenize(content);
        const parseResult = parser.parse(lexResult.tokens);
        const visitResult = visitor.stages(parseResult.children);
        return visitResult;
    }
    catch (error) {
        throw error;
    }
}
