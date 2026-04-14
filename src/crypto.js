// vim: ts=4:sw=4

'use strict';

const { webcrypto } = require('crypto');
const subtle = webcrypto.subtle;
const assert = require('assert');


function assertBuffer(value) {
    if (!(value instanceof Buffer)) {
        throw TypeError(`Expected Buffer instead of: ${value.constructor.name}`);
    }
    return value;
}


async function encrypt(key, data, iv) {
    assertBuffer(key);
    assertBuffer(data);
    assertBuffer(iv);
    const cryptoKey = await subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
    const encrypted = await subtle.encrypt({ name: 'AES-CBC', iv }, cryptoKey, data);
    return Buffer.from(encrypted);
}


async function decrypt(key, data, iv) {
    assertBuffer(key);
    assertBuffer(data);
    assertBuffer(iv);
    const cryptoKey = await subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
    const decrypted = await subtle.decrypt({ name: 'AES-CBC', iv }, cryptoKey, data);
    return Buffer.from(decrypted);
}


async function calculateMAC(key, data) {
    assertBuffer(key);
    assertBuffer(data);
    const cryptoKey = await subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const mac = await subtle.sign('HMAC', cryptoKey, data);
    return Buffer.from(mac);
}


async function hash(data) {
    const result = await subtle.digest('SHA-512', data);
    return Buffer.from(result);
}


// Salts always end up being 32 bytes
async function deriveSecrets(input, salt, info, chunks) {
    // Specific implementation of RFC 5869 that only returns the first 3 32-byte chunks
    assertBuffer(input);
    assertBuffer(salt);
    assertBuffer(info);
    if (salt.byteLength != 32) {
        throw new Error("Got salt of incorrect length");
    }
    chunks = chunks || 3;
    assert(chunks >= 1 && chunks <= 3);
    const PRK = await calculateMAC(salt, input);
    const infoArray = new Uint8Array(info.byteLength + 1 + 32);
    infoArray.set(info, 32);
    infoArray[infoArray.length - 1] = 1;
    const signed = [await calculateMAC(PRK, Buffer.from(infoArray.slice(32)))];
    if (chunks > 1) {
        infoArray.set(signed[signed.length - 1]);
        infoArray[infoArray.length - 1] = 2;
        signed.push(await calculateMAC(PRK, Buffer.from(infoArray)));
    }
    if (chunks > 2) {
        infoArray.set(signed[signed.length - 1]);
        infoArray[infoArray.length - 1] = 3;
        signed.push(await calculateMAC(PRK, Buffer.from(infoArray)));
    }
    return signed;
}

async function verifyMAC(data, key, mac, length) {
    const calculatedMac = (await calculateMAC(key, data)).subarray(0, length);
    if (mac.length !== length || calculatedMac.length !== length) {
       throw new Error("Bad MAC length Expected: " + length +
            " Got: " + mac.length + " and " + calculatedMac.length);
    }
    let diff = 0;
    for (let i = 0; i < length; i++) {
        diff |= mac[i] ^ calculatedMac[i];
    }
    if (diff !== 0) {
         throw new Error("Bad MAC Expected: " + calculatedMac.toString('hex') +
            " Got: " + mac.toString('hex'));
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
