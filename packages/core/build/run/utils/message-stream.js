var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var MessageStream;
(function (MessageStream) {
    class Duplex {
        constructor() {
            this.messagesToHandle = [];
        }
        write(message) {
            var _a, _b, _c;
            (_a = this.streamConnected) === null || _a === void 0 ? void 0 : _a.messagesToHandle.push(message);
            (_c = (_b = this.streamConnected) === null || _b === void 0 ? void 0 : _b.onMessageReceived) === null || _c === void 0 ? void 0 : _c.call(_b, message);
        }
        read() {
            return this.messagesToHandle.shift();
        }
        readNextMessage() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(resolve => {
                    setInterval(() => {
                        const message = this.read();
                        if (message) {
                            resolve(message);
                        }
                    });
                });
            });
        }
    }
    MessageStream.Duplex = Duplex;
    function connect(stream1, stream2) {
        stream1.streamConnected = stream2;
        stream2.streamConnected = stream1;
    }
    MessageStream.connect = connect;
})(MessageStream || (MessageStream = {}));
export default MessageStream;
