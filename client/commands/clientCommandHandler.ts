import { Client } from "../clientInstance";
import { encrypt } from "../../utils/edUtils";

function processEnteredCommand(this: Client, command: string) {
    let formated = command.slice(1, command.length);

    switch (formated) {
        case "exit":
            this.rl.emit("SIGINT");
            break;
        case "help":
            console.log(
                "/help - show this menu\n/ping - check ping\n/online - check count of users online",
            );
            this.rl.prompt();
            break;
        case "online":
        case "ping":
            this.server.write(
                encrypt(
                    JSON.stringify({
                        type: "command",
                        body: formated,
                        metadata: Date.now(),
                    }),
                    this.manager.session_key,
                ),
            );
            break;
        default:
            console.log("No command found");
            this.rl.prompt();
    }
}

export { processEnteredCommand };
