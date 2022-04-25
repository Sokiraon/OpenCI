interface Message {
    type: "out" | "err";
    content: string;
}
export default class MessageStream {
    onMessageReceived?: (message: Message) => void;
    send(message: Message): void;
}
export {};
