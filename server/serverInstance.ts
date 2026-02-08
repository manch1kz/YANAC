import net from "net";
import { SessionManager } from "../security/sessionManager";
import { LocalChatStore } from "../utils/localChatStore";
import { processMessage } from "./handlers/processMessage";
import { setupSocket } from "./handlers/setupSocket";

export class Server {
    localChatStore: LocalChatStore;
    server: net.Server;
    manager: SessionManager;
    connections: Map<any, any>;
    cur: Promise<void>;

    constructor(limit = 100, port = 3000) {
        this.localChatStore = new LocalChatStore(limit);
        this.manager = new SessionManager();
        this.connections = new Map();
        this.server = net.createServer();
        this.cur = Promise.resolve();

        this.server.on("connection", (socket) => {
            this.add(() => {
                setupSocket.call(this, socket, processMessage.bind(this));
            });
        });

        this.server.listen(port);
        console.log("Server is listening...\nPress CTRL + C to stop server\n");
    }

    add(cb: Function) {
        this.cur = this.cur.then(async () => {
            await cb();
            await new Promise((res) => setTimeout(res, 1000));
        });
    }
}
