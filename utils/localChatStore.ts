export class LocalChatStore {
    chat: any
    limit: number

    constructor(limit: number) {
        this.chat = []
        this.limit = limit
    }

    push(message: any) {
        if (this.chat.length >= this.limit) {
            this.chat.splice(0, 1)
        }
        this.chat.push(message)
    }

    getChat() {
        return this.chat
    }
}