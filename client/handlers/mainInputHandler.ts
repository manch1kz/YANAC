import { Client } from "../clientInstance";
import { encrypt } from "../../utils/edUtils";

function onLine(this: Client, line: string) {
    if (line.length > 0) {
        process.stdout.moveCursor(0, -1)
        process.stdout.write('\r\x1B[K');
        console.log(`${this.name}: ${line}`)
        if (line == "/exit") {
            this.rl.emit("SIGINT")
        }
        this.server.write(encrypt(JSON.stringify({type: 'msg', body: [this.name, line]}), this.manager.session_key))
        this.rl.prompt()
    } else {
        process.stdout.moveCursor(0, -1)
        process.stdout.write('\r\x1B[K');
        this.rl.prompt()
    }
}

export { onLine }