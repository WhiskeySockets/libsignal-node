// vim: ts=4:sw=4:expandtab

const crypto = require('../build/Release/signal_crypto');

// Insert some bytes into the emscripten memory and return a pointer
function _allocate(bytes) {
    const address = crypto._malloc(bytes.length);
    crypto.HEAPU8.set(bytes, address);

    return address;
}

function _readBytes(address, length, array) {
    array.set(crypto.HEAPU8.subarray(address, address + length));
}

const basepoint = new Uint8Array(32);
basepoint[0] = 9;

exports.keyPair = function(privKey) {
    const priv = new Uint8Array(privKey);
    priv[0]  &= 248;
    priv[31] &= 127;
    priv[31] |= 64;

    const pubKey = crypto.curve25519_donna(priv, new Uint8Array(32).fill(9));

    return {
        pubKey: pubKey.buffer,
        privKey: priv.buffer
    };
};

exports.sharedSecret = function(pubKey, privKey) {
    return crypto.curve25519_donna(new Uint8Array(privKey), new Uint8Array(pubKey)).buffer;
};

exports.sign = function(privKey, message) {
    // Generate random bytes for the signature
    const random = new Uint8Array(64);
    for(let i = 0; i < 64; i++) {
        random[i] = Math.floor(Math.random() * 256);
    }
    return crypto.curve25519_sign(new Uint8Array(privKey), new Uint8Array(message), random).buffer;
};

exports.verify = function(pubKey, message, sig) {
    return crypto.curve25519_verify(new Uint8Array(sig), new Uint8Array(pubKey), new Uint8Array(message));
};
