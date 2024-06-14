export enum ChainType {
    SENDING = 1,
    RECEIVING = 2
}

export interface ChainSerialized {
    chainKey: {
        counter: number
        key?: string
    },
    chainType: ChainType
    messageKeys: { [key: number] : string }
}

export interface ChainDeserialized {
    chainKey: {
        counter: number
        key?: string | Buffer
    },
    chainType: ChainType
    messageKeys: { [key: number] : Buffer }
}

export interface ChainsSerialized { 
    [key: string] : ChainSerialized 
}

export interface ChainsDeserialized { 
    [key: string] : ChainDeserialized 
}
