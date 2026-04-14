
'use strict';

const curveJs = require('curve25519-js');
const { webcrypto } = require('crypto');
const subtle = webcrypto.subtle;

// DER prefixes for X25519 keys (used for WebCrypto import/export)
// from: https://github.com/digitalbazaar/x25519-key-agreement-key-2019/blob/master/lib/crypto.js
const PUBLIC_KEY_DER_PREFIX = Buffer.from([
    48, 42, 48, 5, 6, 3, 43, 101, 110, 3, 33, 0
]);

const PRIVATE_KEY_DER_PREFIX = Buffer.from([
    48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 110, 4, 34, 4, 32
]);

const KEY_BUNDLE_TYPE = Buffer.from([5]);

const prefixKeyInPublicKey = function (pubKey) {
  return Buffer.concat([KEY_BUNDLE_TYPE, pubKey]);
};

function validatePrivKey(privKey) {
    if (privKey === undefined) {
        throw new Error("Undefined private key");
    }
    if (!(privKey instanceof Buffer)) {
        throw new Error(`Invalid private key type: ${privKey.constructor.name}`);
    }
    if (privKey.byteLength != 32) {
        throw new Error(`Incorrect private key length: ${privKey.byteLength}`);
    }
}

function scrubPubKeyFormat(pubKey) {
    if (!(pubKey instanceof Buffer)) {
        throw new Error(`Invalid public key type: ${pubKey.constructor.name}`);
    }
    if (pubKey === undefined || ((pubKey.byteLength != 33 || pubKey[0] != 5) && pubKey.byteLength != 32)) {
        throw new Error("Invalid public key");
    }
    if (pubKey.byteLength == 33) {
        return pubKey.subarray(1);
    } else {
        console.error("WARNING: Expected pubkey of length 33, please report the ST and client that generated the pubkey");
        return pubKey;
    }
}

function unclampEd25519PrivateKey(clampedSk) {
    const unclampedSk = new Uint8Array(clampedSk);

    // Fix the first byte
    unclampedSk[0] |= 6; // Ensure last 3 bits match expected `110` pattern

    // Fix the last byte
    unclampedSk[31] |= 128; // Restore the highest bit
    unclampedSk[31] &= ~64; // Clear the second-highest bit

    return unclampedSk;
}

exports.getPublicFromPrivateKey = async function(privKey) {
    const unclampedPK = unclampEd25519PrivateKey(privKey);
    const keyPair = curveJs.generateKeyPair(unclampedPK);
    return prefixKeyInPublicKey(Buffer.from(keyPair.public));
};

exports.generateKeyPair = async function() {
    const keyPair = await subtle.generateKey({ name: 'X25519' }, true, ['deriveBits']);

    const publicKeyRaw = await subtle.exportKey('raw', keyPair.publicKey);
    const privateKeyDer = await subtle.exportKey('pkcs8', keyPair.privateKey);

    const pubKey = Buffer.from(publicKeyRaw);
    const privKey = Buffer.from(new Uint8Array(privateKeyDer).subarray(PRIVATE_KEY_DER_PREFIX.length));

    return {
        pubKey: prefixKeyInPublicKey(pubKey),
        privKey
    };
};

exports.calculateAgreement = async function(pubKey, privKey) {
    pubKey = scrubPubKeyFormat(pubKey);
    validatePrivKey(privKey);
    if (!pubKey || pubKey.byteLength != 32) {
        throw new Error("Invalid public key");
    }

    const privateKeyObj = await subtle.importKey(
        'pkcs8',
        Buffer.concat([PRIVATE_KEY_DER_PREFIX, privKey]),
        { name: 'X25519' },
        false,
        ['deriveBits']
    );
    const publicKeyObj = await subtle.importKey(
        'raw',
        pubKey,
        { name: 'X25519' },
        false,
        []
    );

    const shared = await subtle.deriveBits({ name: 'X25519', public: publicKeyObj }, privateKeyObj, 256);
    return Buffer.from(shared);
};

// XEdDSA signatures use Curve25519 keys converted to Ed25519-style — not supported by
// WebCrypto, so we keep using curve25519-js here but expose an async interface for
// consistency with the rest of the module.
exports.calculateSignature = async function(privKey, message) {
    validatePrivKey(privKey);
    if (!message) {
        throw new Error("Invalid message");
    }
    return Buffer.from(curveJs.sign(privKey, message));
};

exports.verifySignature = async function(pubKey, msg, sig, isInit) {
    pubKey = scrubPubKeyFormat(pubKey);
    if (!pubKey || pubKey.byteLength != 32) {
        throw new Error("Invalid public key");
    }
    if (!msg) {
        throw new Error("Invalid message");
    }
    if (!sig || sig.byteLength != 64) {
        throw new Error("Invalid signature");
    }
    return isInit ? true : curveJs.verify(pubKey, msg, sig);
};
