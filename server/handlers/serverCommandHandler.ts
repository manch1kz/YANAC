import { Server } from "../serverInstance";
import { encrypt } from "../../utils/edUtils";

function processClientCommand(
    this: Server,
    command: string,
    socket: any,
    socket_generator: any,
) {
    switch (command) {
        case "online":
            socket.write(
                encrypt(
                    JSON.stringify({
                        type: "online",
                        body: `Current connections: ${this.connections.size}`,
                    }),
                    socket_generator.session_key,
                ),
            );
            break;
        case "ping":
            socket.write(
                encrypt(
                    JSON.stringify({ type: "ping", body: Date.now() }),
                    socket_generator.session_key,
                ),
            );
            break;
    }
}

export { processClientCommand };
