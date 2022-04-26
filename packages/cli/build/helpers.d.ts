export declare function promptConfirm(message: string): Promise<boolean>;
declare type InquirerAnswer = string[] | number[] | string | number | boolean;
export declare function promptQuestion(question: {
    type: string;
    message: string;
}): Promise<InquirerAnswer>;
export {};
