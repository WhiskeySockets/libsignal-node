// vim: ts=4:sw=4

'use strict';

const nodeCrypto = require('crypto');
const assert = require('assert');


function assertBuffer(value) {
    if (!(value instanceof Buffer)) {
        throw TypeError(`Expected Buffer instead of: ${value.constructor.name}`);
    }
    return value;
}


function encrypt(key, data, iv) {
    assertBuffer(key);
    assertBuffer(data);
    assertBuffer(iv);
    const cipher = nodeCrypto.createCipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]);
}


function decrypt(key, data, iv) {
    assertBuffer(key);
    assertBuffer(data);
    assertBuffer(iv);
    const decipher = nodeCrypto.createDecipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}


function calculateMAC(key, data) {
    assertBuffer(key);
    assertBuffer(data);
    const hmac = nodeCrypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest();
}



function hash(data) {
    assertBuffer(data);
    const sha512 = nodeCrypto.createHash('sha512');
    sha512.update(data);
    return sha512.digest();
}


// Salts always end up being 32 bytes
function deriveSecrets(input, salt, info, chunks = 3) {
    assertBuffer(input);
    assertBuffer(salt);
    assertBuffer(info);
    if (salt.length !== 32) {
        throw new Error("Got salt of incorrect length");
    }
    assert(chunks >= 1 && chunks <= 3);

    const PRK = calculateMAC(salt, input);
    const signed = [];

    let previous = Buffer.alloc(0);
    for (let i = 1; i <= chunks; i++) {
        const buffer = Buffer.concat([
            previous,
            info,
            Buffer.from([i])
        ]);
        previous = calculateMAC(PRK, buffer);
        signed.push(previous);
    }

    return signed;
}


function verifyMAC(data, key, mac, length) {
    const calculatedMac = calculateMAC(key, data).subarray(0, length);
    if (mac.length !== length || calculatedMac.length !== length) {
        throw new Error("Bad MAC length");
    }
    if (!nodeCrypto.timingSafeEqual(mac, calculatedMac)) {
        throw new Error("Bad MAC");
    }
}

module.exports = {
    deriveSecrets,
    decrypt,
    encrypt,
    hash,
    calculateMAC,
    verifyMAC
};
