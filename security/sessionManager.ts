import crypto from "crypto";

export class SessionManager {
    client_random: any;
    server_random: any;
    master_random: any;
    session_key: any;
    privateKey: any;
    publicKey: any;

    constructor() {
        this.client_random = null;
        this.server_random = null;
        this.master_random = null;
        this.session_key = null;

        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                format: "pem",
                type: "pkcs1",
            },
            privateKeyEncoding: {
                format: "pem",
                type: "pkcs1",
            },
        });

        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    generateSession() {
        if (this.client_random && this.server_random && this.master_random) {
            const sum =
                this.client_random +
                this.server_random +
                Number(this.master_random);
            this.session_key = crypto
                .createHash("sha256")
                .update(String(sum))
                .digest()
                .toString("hex");
        }
    }

    setClient(client_random: any) {
        this.client_random = client_random;
    }

    getClient() {
        if (this.client_random == null) {
            this.client_random = Math.floor(Math.random() * 5000);
        }
        return this.client_random;
    }

    getServer() {
        if (this.server_random == null) {
            this.server_random = Math.floor(Math.random() * 5000);
        }
        return this.server_random;
    }

    setServer(server_random: any) {
        this.server_random = server_random;
    }

    getMaster(public_key: any) {
        if (this.master_random == null) {
            this.master_random = String(Math.floor(Math.random() * 5000));
        }

        return crypto
            .publicEncrypt(
                {
                    key: public_key,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                this.master_random,
            )
            .toString("base64");
    }

    setMaster(master_random: any, private_key: any) {
        this.master_random = crypto
            .privateDecrypt(
                {
                    key: private_key,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                Buffer.from(master_random, "base64"),
            )
            .toString();
    }
}
