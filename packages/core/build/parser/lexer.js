import { createToken, Lexer } from "chevrotain";
export const KeywordStages = createToken({
    name: "Stages",
    pattern: /stages/,
});
export const KeywordEnv = createToken({
    name: "Env",
    pattern: /env/,
});
export const KeywordEcho = createToken({
    name: "Echo",
    pattern: /echo/,
});
export const KeywordShell = createToken({
    name: "Shell",
    pattern: /sh/,
});
export const KeywordNode = createToken({
    name: "Node",
    pattern: /node/,
});
export const KeywordSelectBranch = createToken({
    name: "SelectBranch",
    pattern: /selectBranch/,
});
export const InquirerInput = createToken({
    name: "Input",
    pattern: /input/,
});
export const InquirerRawList = createToken({
    name: "RawList",
    pattern: /rawlist/,
});
export const InquirerCheckbox = createToken({
    name: "Checkbox",
    pattern: /checkbox/,
});
export const InquirerConfirm = createToken({
    name: "Confirm",
    pattern: /confirm/,
});
export const StageName = createToken({
    name: "StageName",
    pattern: /[a-z]\w*/,
});
export const Identifier = createToken({
    name: "Identifier",
    pattern: /[A-Z]\w*/,
});
export const Whitespace = createToken({
    name: "Whitespace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});
export const Comment = createToken({
    name: "Comment",
    pattern: /\/\/[^\n]*|\/\*(.|\s)*\*\//,
    group: Lexer.SKIPPED,
});
export const Str = createToken({
    name: "String",
    pattern: /("[^"\r\n]*")|('[^'\r\n]*')|(`[^`]*`)/,
});
export const Num = createToken({
    name: "Number",
    pattern: /[1-9]\d*(\.\d+)?/,
});
export const Equal = createToken({
    name: "Equal",
    pattern: /=/,
});
export const Comma = createToken({
    name: "Comma",
    pattern: /,/,
});
export const CurlyLeft = createToken({
    name: "CurlyLeft",
    pattern: /\{/,
});
export const CurlyRight = createToken({
    name: "CurlyRight",
    pattern: /\}/,
});
export const ParenLeft = createToken({
    name: "ParenLeft",
    pattern: /\(/,
});
export const ParenRight = createToken({
    name: "ParenRight",
    pattern: /\)/,
});
export const SquareLeft = createToken({
    name: "SquareLeft",
    pattern: /\[/,
});
export const SquareRight = createToken({
    name: "SquareRight",
    pattern: /\]/,
});
export const tokens = [
    Whitespace,
    Comment,
    Equal,
    Comma,
    CurlyLeft,
    CurlyRight,
    ParenLeft,
    ParenRight,
    SquareLeft,
    SquareRight,
    Str,
    Num,
    InquirerInput,
    InquirerRawList,
    InquirerCheckbox,
    InquirerConfirm,
    KeywordStages,
    KeywordEnv,
    KeywordEcho,
    KeywordShell,
    KeywordNode,
    KeywordSelectBranch,
    StageName,
    Identifier,
];
const lexer = new Lexer(tokens);
export default lexer;
