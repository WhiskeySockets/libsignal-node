import { EphemeralKeyPairDeserialized } from '../Types/Session';
import { generateKeyPair, calculateSignature } from '../Utils/curve';
import * as crypto from 'crypto'

function isNonNegativeInteger(n: number) {
    return Number.isInteger(n) && n >= 0;
}

export function generateRegistrationId() {
    var registrationId = Uint16Array.from(crypto.randomBytes(2))[0];
    return registrationId & 0x3fff;
};

export function generateSignedPreKey(identityKeyPair: EphemeralKeyPairDeserialized, signedKeyId: number) {
    if (!isNonNegativeInteger(signedKeyId)) {
        throw new TypeError('Invalid argument for signedKeyId: ' + signedKeyId);
    }

    const keyPair = generateKeyPair();
    const sig = calculateSignature(identityKeyPair.privKey, keyPair.pubKey);
    return {
        keyId: signedKeyId,
        keyPair: keyPair,
        signature: sig
    };
};

export function generatePreKey(keyId: number) {
    if (!isNonNegativeInteger(keyId)) {
        throw new TypeError('Invalid argument for keyId: ' + keyId);
    }
    
    const keyPair = generateKeyPair()
    return {
        keyId,
        keyPair
    }
}
