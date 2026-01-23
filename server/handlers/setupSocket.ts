import { SessionManager } from "../../security/sessionManager"
import { encrypt, decrypt } from "../../utils/edUtils"
import { Server } from "../serverInstance"
import net from 'net'

function setupSocket(this: Server, socket: net.Socket, cb: Function) {
    this.connections.set(socket, {name: null, generator: new SessionManager(), key_generated: false})

    socket.on('close', () => {
        let body = ['[SERVER]', this.connections.get(socket).name + ' disconnected from server']
        this.localChatStore.push(body)

        Array.from(this.connections.keys()).forEach((i: any) => {
            i.write(encrypt(JSON.stringify({type: 'msg', data: body}), this.connections.get(i).generator.session_key))
        })
        this.connections.delete(socket)
    })

    socket.on("error", () => {}) 

    socket.on('data', (data: any) => {
        cb(socket, data)
    })
}

export { setupSocket }