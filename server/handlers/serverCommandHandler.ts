import { Server } from "../serverInstance";
import { encrypt } from "../../utils/edUtils";

function processClientCommand(
    this: Server,
    message: any,
    socket: any,
    socket_generator: any,
) {
    switch (message.body) {
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
                    JSON.stringify({ type: "ping", body: message.metadata }),
                    socket_generator.session_key,
                ),
            );
            break;
    }
}

export { processClientCommand };
