import * as crypto from 'crypto'
import assert from 'assert'

export function calculateMAC(key: Buffer, data: Buffer) {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(data)
    return Buffer.from(hmac.digest())
}

export function encrypt(key: Buffer, data: Buffer, iv: Buffer) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    return Buffer.concat([cipher.update(data), cipher.final()])
}

export function decrypt(key: Buffer, data: Buffer | Uint8Array, iv: Buffer) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    return Buffer.concat([decipher.update(data), decipher.final()])
}

export function hash(data: Buffer) {
    const sha512 = crypto.createHash('sha512')
    sha512.update(data)
    return sha512.digest()
}

/** Salts always end up being 32 bytes 
 * 
 * Specific implementation of RFC 5869 that only returns the first 3 32-byte chunks
*/
export function deriveSecrets(input: Buffer, salt: Buffer, info: Buffer, chunks?: number) {
    if (salt.byteLength !== 32) {
        throw new Error("Got salt of incorrect length")
    }

    chunks = chunks || 3
    assert(chunks >= 1 && chunks <= 3)

    const PRK = calculateMAC(salt, input)
    const infoArray = new Uint8Array(info.byteLength + 1 + 32)

    infoArray.set(info, 32)
    infoArray[infoArray.length - 1] = 1
    const signed = [calculateMAC(PRK, Buffer.from(infoArray.slice(32)))]

    if (chunks > 1) {
        infoArray.set(signed[signed.length - 1])
        infoArray[infoArray.length - 1] = 2
        signed.push(calculateMAC(PRK, Buffer.from(infoArray)))
    }
    if (chunks > 2) {
        infoArray.set(signed[signed.length - 1])
        infoArray[infoArray.length - 1] = 3
        signed.push(calculateMAC(PRK, Buffer.from(infoArray)))
    }

    return signed
}

export function verifyMAC(data: Buffer, key: Buffer, mac: Buffer, length: number) {
    const calculatedMac = calculateMAC(key, data).slice(0, length)
    if (mac.length !== length || calculatedMac.length !== length) {
        throw new Error("Bad MAC length")
    }
    if (!mac.equals(calculatedMac)) {
        throw new Error("Bad MAC")
    }
}
