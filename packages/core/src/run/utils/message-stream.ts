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

namespace MessageStream {
  export type Message = TextMessage | UserInputRequest | UserInputResponse;

  export class Duplex {
    streamConnected?: Duplex;
    messagesToHandle: Message[] = [];
    onMessageReceived?: (message: Message) => void;

    write(message: Message) {
      this.streamConnected?.messagesToHandle.push(message);
      this.streamConnected?.onMessageReceived?.(message);
    }

    read() {
      return this.messagesToHandle.shift();
    }
  }

  export function connect(stream1: Duplex, stream2: Duplex) {
    stream1.streamConnected = stream2;
    stream2.streamConnected = stream1;
  }
}

export default MessageStream;
