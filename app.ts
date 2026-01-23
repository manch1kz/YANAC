#!/usr/bin/env node

import { Command } from "commander"
import { Server } from "./server/serverInstance"
import { Client } from "./client/clientInstance"

const program = new Command()
    
program.command("start <type>")
    .option("--port <port>", "Server port (default: 3000)")
    .option("--host <host>", "Server host (default: localhost)")
    .option("--name <name>", "Client name (default: random_str)")
    .option("--limit <limit>", "Limit of chat storage (default: 100)")
    .action((str, options) => {
        switch (str) {
            case "server":
                const server = new Server(
                    Number(options.limit) ? Number(options.limit) : undefined,
                    Number(options.port) ? Number(options.port) : undefined
                )
                break;
            case "client":
                const client = new Client(options.name, options.host, Number(options.port) ? Number(options.port) : undefined)
                break;
        }
    })

program.parse()
    