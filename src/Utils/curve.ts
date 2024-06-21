import * as curveJs from 'curve25519-js'
import * as crypto from 'crypto'

function validatePrivKey(privKey: Buffer) {
    if (privKey === undefined) {
        throw new Error("Undefined private key")
    }
    if (!(privKey instanceof Buffer)) {
        throw new Error(`Invalid private key type`)
    }
    if (privKey.byteLength != 32) {
        throw new Error(`Incorrect private key length`)
    }
}

function scrubPubKeyFormat(pubKey: Buffer | undefined) {
    if (!(pubKey instanceof Buffer)) {
        throw new Error(`Invalid public key type`)
    }
    if (pubKey === undefined || ((pubKey.byteLength != 33 || pubKey[0] != 5) && pubKey.byteLength != 32)) {
        throw new Error("Invalid public key")
    }
    if (pubKey.byteLength == 33) {
        return pubKey.slice(1)
    } else {
        console.error("WARNING: Expected pubkey of length 33, please report the ST and client that generated the pubkey")
        return pubKey
    }
}

export function generateKeyPair() {
    const keyPair = curveJs.generateKeyPair(crypto.randomBytes(32))
    return {
        privKey: Buffer.from(keyPair.private),
        pubKey: Buffer.from(keyPair.public)
    }
}

export function calculateAgreement(pubKey: Buffer | undefined, privKey: Buffer) {
    pubKey = scrubPubKeyFormat(pubKey)
    validatePrivKey(privKey)
    if (!pubKey || pubKey.byteLength != 32) {
        throw new Error("Invalid public key")
    }

    const secret = curveJs.sharedKey(privKey, pubKey)
    return Buffer.from(secret)
}

export function calculateSignature(privKey: Buffer, message: any) {
    validatePrivKey(privKey)
    if (!message) {
        throw new Error("Invalid message")
    }
    return Buffer.from(curveJs.sign(privKey, message, []))
}

export function verifySignature(pubKey: Buffer, msg: any, sig: Buffer) {
    pubKey = scrubPubKeyFormat(pubKey)
    if (!pubKey || pubKey.byteLength != 32) {
        throw new Error("Invalid public key")
    }
    if (!msg) {
        throw new Error("Invalid message")
    }
    if (!sig || sig.byteLength != 64) {
        throw new Error("Invalid signature")
    }
    return curveJs.verify(pubKey, msg, sig)
}
