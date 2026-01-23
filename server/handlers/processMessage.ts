import { encrypt, decrypt } from "../../utils/edUtils"
import { Server } from "../serverInstance"

function processMessage(this: Server, socket: any, data: any) {
    const socket_item = this.connections.get(socket)
    const socket_generator = socket_item.generator
    let message

    if (socket_item.key_generated) {
        message = JSON.parse(decrypt(data.toString(), socket_item.generator.session_key))
    } else {
        message = JSON.parse(data.toString())
    }

    switch (message.type) {
        case 'msg':
            this.localChatStore.push(message.body)
            Array.from(this.connections.keys()).forEach((i: any) => {
                if (i != socket) {
                    i.write(encrypt(JSON.stringify({type: 'msg', data: message.body}), this.connections.get(i).generator.session_key))
                }
            })
            break;
        case 'public_key_request':
            const server_random = this.manager.getServer()

            socket_generator.setClient(message.body)
            socket_generator.setServer(server_random)

            socket.write(JSON.stringify({type: 'public_key_response', body: [this.manager.publicKey, server_random]}))
            break;
        case 'master_key_response':
            socket_generator.setMaster(message.body[0], this.manager.privateKey)
            socket_generator.generateSession()
            socket_item.name = message.body[1]
            socket_item.key_generated = true

            socket.write(JSON.stringify({type: 'finished'}))
            break;
        case 'finished':
            socket_item.name = message.body
            socket.write(encrypt(JSON.stringify({type: 'history', body: this.localChatStore.getChat()}), socket_generator.session_key))
            this.localChatStore.push(['[SERVER]', message.body + ' connected to server'])

            Array.from(this.connections.keys()).forEach((i: any) => {
                if (i != socket) {
                    i.write(
                        encrypt(JSON.stringify({type: 'msg', data: ['[SERVER]', message.body + ' connected to server']}), 
                        this.connections.get(i).generator.session_key)
                    )
                }
            })
            break;
    }
}

export { processMessage }