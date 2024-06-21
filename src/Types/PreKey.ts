export interface PreKeyDeserialized {
    registrationId: string
    preKeyId: number
    signedPreKeyId?: number
    baseKey: Buffer | Uint8Array
    identityKey: Buffer | Uint8Array
    message?: Buffer | Uint8Array
}

export interface PreKeySerialized {
    registrationId: string
    preKeyId: number
    signedPreKeyId?: number
    baseKey: string
    identityKey: string
    message?: string
}

export interface PendingPreKeyDeserialized {
    registrationId?: number
    preKeyId?: number
    signedKeyId?: number
    baseKey?: Buffer | Uint8Array
    identityKey?: Buffer | Uint8Array
    message?: Buffer | Uint8Array
}

export interface PendingPreKeySerialized {
    registrationId?: number
    preKeyId?: number
    signedKeyId?: number
    baseKey?: string
    identityKey?: string
    message?: string
}