import { encrypt, decrypt } from "../../utils/edUtils";
import { processClientCommand } from "./serverCommandHandler";
import { Server } from "../serverInstance";

function broadcast(this: Server, body: any, exclude = []) {
    let stringifyed = JSON.stringify({ type: "msg", body: body });
    this.localChatStore.push(body);

    for (let [connection, metadata] of this.connections) {
        if (!exclude.includes(connection)) {
            connection.write(
                encrypt(stringifyed, metadata.generator.session_key),
            );
        }
    }
}

function processMessage(this: Server, socket: any, data: any) {
    const socket_item = this.connections.get(socket);
    const socket_generator = socket_item.generator;

    let message = socket_item.key_generated
        ? JSON.parse(decrypt(data.toString(), socket_generator.session_key))
        : JSON.parse(data.toString());

    switch (message.type) {
        case "msg":
            broadcast.call(this, message.body, [socket]);
            break;
        case "command":
            processClientCommand.call(
                this,
                message.body,
                socket,
                socket_generator,
            );
            break;
        case "finished":
            socket_item.name = message.body;
            socket.write(
                encrypt(
                    JSON.stringify({
                        type: "history",
                        body: this.localChatStore.getChat(),
                    }),
                    socket_generator.session_key,
                ),
            );
            broadcast.call(
                this,
                ["[SERVER]", message.body + " connected to server"],
                [socket],
            );
            break;
        case "public_key_request":
            const server_random = this.manager.getServer();
            socket_generator.setClient(message.body);
            socket_generator.setServer(server_random);
            socket.write(
                JSON.stringify({
                    type: "public_key_response",
                    body: [this.manager.publicKey, server_random],
                }),
            );
            break;
        case "master_key_response":
            socket_generator.setMaster(
                message.body[0],
                this.manager.privateKey,
            );
            socket_generator.generateSession();
            socket_item.name = message.body[1];
            socket_item.key_generated = true;
            socket.write(JSON.stringify({ type: "finished" }));
            break;
    }
}

export { processMessage };
