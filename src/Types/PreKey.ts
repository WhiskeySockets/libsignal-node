export interface PreKeyDeserialized {
    registrationId?: number
    preKeyId?: number
    signedKeyId?: number
    baseKey?: Buffer | Uint8Array
    identityKey?: Buffer | Uint8Array
    message?: Buffer | Uint8Array
}

export interface PreKeySerialized {
    registrationId?: number
    preKeyId?: number
    signedKeyId?: number
    baseKey?: string
    identityKey?: string
    message?: string
}
