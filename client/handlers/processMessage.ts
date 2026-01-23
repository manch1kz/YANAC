import { decrypt, encrypt } from "../../utils/edUtils"
import { Client } from "../clientInstance"

async function processMessage(this: Client, data: any) {
    const cur = this.rl.getCursorPos()
    let processed

    if (this.key_generated) {
        processed = JSON.parse(decrypt(data.toString(), this.manager.session_key))
    } else {
        processed = JSON.parse(data.toString('utf-8'))
    }
   
    switch (processed.type) {
        case 'public_key_response':
            this.manager.setServer(processed.body[1])
            this.server.write(JSON.stringify({type: 'master_key_response', body: [this.manager.getMaster(processed.body[0]), this.name]}))
            break;
        case 'finished':
            this.manager.generateSession()
            this.key_generated = true
            this.server.write(encrypt(JSON.stringify({type: "finished", body: this.name}), this.manager.session_key))
            this.rl.prompt()
            break;
        case 'history':
            process.stdout.write('\r\x1B[K')

            for (let i = 0; i < processed.body.length; i++) {
                console.log(processed.body[i][0] + ':', processed.body[i][1])
            }

            console.log('[SERVER]:', this.name, 'connected to server')

            this.rl.prompt(true)
            process.stdout.cursorTo(cur.cols)
            break;
        case 'msg':
            process.stdout.write('\r\x1B[K');
            console.log(processed.data[0] + ':', processed.data[1])

            this.rl.prompt(true)
            process.stdout.cursorTo(cur.cols)
            break;
    }
}

export { processMessage }