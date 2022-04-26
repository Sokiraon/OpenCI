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
    }
    MessageStream.Duplex = Duplex;
    function connect(stream1, stream2) {
        stream1.streamConnected = stream2;
        stream2.streamConnected = stream1;
    }
    MessageStream.connect = connect;
})(MessageStream || (MessageStream = {}));
export default MessageStream;
