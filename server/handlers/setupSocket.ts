import { SessionManager } from "../../security/sessionManager";
import { encrypt, decrypt } from "../../utils/edUtils";
import { Server } from "../serverInstance";
import net from "net";

function setupSocket(this: Server, socket: net.Socket, cb: Function) {
    this.connections.set(socket, {
        name: null,
        generator: new SessionManager(),
        key_generated: false,
    });

    socket.on("close", () => {
        let name = this.connections.get(socket).name;
        let body = ["[SERVER]", name + " disconnected from server"];
        this.localChatStore.push(body);

        for (let [connection, metadata] of this.connections) {
            connection.write(
                encrypt(
                    JSON.stringify({ type: "msg", body: body }),
                    metadata.generator.session_key,
                ),
            );
        }

        this.connections.delete(socket);
    });

    socket.on("error", () => {});

    socket.on("data", (data: any) => {
        cb(socket, data);
    });
}

export { setupSocket };
