import crypto from "crypto"

function formatKey(key: string) {
    if (key.length > 32) {
        key = key.slice(0, 32)
    } else if (key.length < 32) {
        key += Array.from({length: 32 - key.length}, () => 0).join('')
    }

    return key
}

function encrypt(value: string, key: string) {
    key = formatKey(key)

    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

    let encrypted = cipher.update(value, "utf-8", "hex")
    encrypted += cipher.final("hex")

    return encrypted
}

function decrypt(value: string, key: string) {
    key = formatKey(key)  

    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

    let decrypted = decipher.update(value, "hex", "utf-8")
    decrypted += decipher.final("utf-8")

    return decrypted
}

export { encrypt, decrypt }