import { BaseKeyType } from './BaseKey'
import { ChainsDeserialized, ChainsSerialized } from './Chains'
import { PreKeyDeserialized, PreKeySerialized } from './PreKey'

export interface EphemeralKeyPairSerialized {
    pubKey: string
    privKey: string   
}

export interface EphemeralKeyPairDeserialized {
    pubKey: Buffer
    privKey: Buffer 
}

export interface SessionSerialized {
    registrationId: string
    currentRatchet: {
        ephemeralKeyPair: EphemeralKeyPairSerialized
        lastRemoteEphemeralKey: string
        previousCounter: number
        rootKey: string
    }
    indexInfo: {
        baseKey: string
        baseKeyType: BaseKeyType
        closed: number
        used: number
        created: number
        remoteIdentityKey: string
    }
    _chains: ChainsSerialized
    pendingPreKey?: PreKeySerialized
}

export interface SessionDeserialized {
    registrationId: string
    currentRatchet: {
        ephemeralKeyPair: EphemeralKeyPairDeserialized
        lastRemoteEphemeralKey: Buffer
        previousCounter: number
        rootKey: Buffer
    }
    indexInfo: {
        baseKey: Buffer
        baseKeyType: BaseKeyType
        closed: number
        used: number
        created: number
        remoteIdentityKey: Buffer
    }
    _chains: ChainsDeserialized
    pendingPreKey?: PreKeyDeserialized
}

export interface SessionDeserializedList {
    [key: string]: SessionDeserialized
}

export interface SessionSerializedList {
    [key: string]: SessionSerialized
}

export interface SessionRecordList {
    _sessions: SessionSerializedList
    version: string
    registrationId?: string
}

export interface Migration {
    version: string
    migrate(data: any): void
}
