interface TextMessage {
    type: "output" | "error";
    content: string;
}
interface UserInputRequest {
    type: "inputReq";
    content: {
        type: string;
        message: string;
    };
}
interface UserInputResponse {
    type: "inputRes";
    content: string;
}
declare type Message = TextMessage | UserInputRequest | UserInputResponse;
declare namespace MessageStream {
    class Duplex {
        streamConnected?: Duplex;
        messagesToHandle: Message[];
        onMessageReceived?: (message: Message) => void;
        write(message: Message): void;
        read(): Message | undefined;
        readNextMessage(): Promise<Message>;
    }
    function connect(stream1: Duplex, stream2: Duplex): void;
}
export default MessageStream;
