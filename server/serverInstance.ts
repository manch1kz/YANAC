import net from 'net'
import { SessionManager } from '../security/sessionManager'
import { LocalChatStore } from '../utils/localChatStore'
import { processMessage } from "./handlers/processMessage"
import { setupSocket } from "./handlers/setupSocket"

export class Server {
    localChatStore: LocalChatStore
    server: net.Server
    manager: SessionManager
    connections: Map<any, any>

    constructor(limit=100, port=3000) {
        this.localChatStore = new LocalChatStore(100)
        this.manager = new SessionManager()
        this.connections = new Map()
        this.server = net.createServer()

        this.server.on("connection", (socket) => {
            setupSocket.call(this, socket, processMessage.bind(this))
        })

        this.server.listen(port)
    }
}