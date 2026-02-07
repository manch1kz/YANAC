import net from "net";
import readline from "readline/promises";
import { SessionManager } from "../security/sessionManager";
import { processMessage } from "./handlers/processMessage";
import { onLine } from "./handlers/mainInputHandler";
import { genName } from "../utils/genNameAlias";

export class Client {
    manager: SessionManager;
    rl: readline.Interface;
    name: string;
    server: net.Socket;
    key_generated: boolean;

    constructor(name = genName(), host = "localhost", port = 3000) {
        this.name = name;
        this.server = net.connect({ host: host, port: port });
        this.key_generated = false;
        this.manager = new SessionManager();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `${this.name} >>> `,
        });

        this.server.on("connect", () => {
            this.server.write(
                JSON.stringify({
                    type: "public_key_request",
                    body: this.manager.getClient(),
                }),
            );
        });
        this.server.on("data", (data) => {
            processMessage.call(this, data);
        });

        this.rl.on("line", onLine.bind(this));

        this.server.on("error", () => {
            console.log("\nServer closed or doesn't exist :(");
        });
        this.server.on("close", () => {
            this.server.end();
            process.exit();
        });
        this.rl.on("SIGINT", () => {
            this.server.end();
            process.exit();
        });
    }
}
