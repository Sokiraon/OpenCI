export default class MessageStream {
    send(message) {
        var _a;
        (_a = this.onMessageReceived) === null || _a === void 0 ? void 0 : _a.call(this, message);
    }
}
