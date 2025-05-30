const crypto = require('../build/Release/signal_crypto');
const basepoint = new Uint8Array(32);
basepoint[0] = 9;

exports.keyPair = function(privKey) {
    const priv = new Uint8Array(privKey);
    priv[0]  &= 248;
    priv[31] &= 127;
    priv[31] |= 64;

    const pubKey = crypto.curve25519_donna(priv, basepoint);

    return {
        pubKey: pubKey.buffer,
        privKey: priv.buffer
    };
};

exports.sharedSecret = function(pubKey, privKey) {
    privKey[0]  &= 248;
    privKey[31] &= 127;
    privKey[31] |= 64;

    return crypto.curve25519_donna(new Uint8Array(privKey), new Uint8Array(pubKey)).buffer;
};

exports.sign = function(privKey, message) {
    return crypto.curve25519_sign(new Uint8Array(privKey), new Uint8Array(message)).buffer;
};

exports.verify = function(pubKey, message, sig) {
    return crypto.curve25519_verify(new Uint8Array(sig), new Uint8Array(pubKey), new Uint8Array(message));
};
