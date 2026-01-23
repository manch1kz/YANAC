import crypto from "crypto"

function genName() {
    return crypto.randomBytes(8).toString("hex")
}

export { genName }