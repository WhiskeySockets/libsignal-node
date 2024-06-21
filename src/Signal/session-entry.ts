import { EphemeralKeyPairDeserialized, SessionDeserialized, SessionSerialized } from '../Types/Session';
import { ChainDeserialized, ChainsDeserialized, ChainsSerialized } from '../Types/Chains'
import { BaseKeyType } from '../Types/BaseKey';
import { PendingPreKeyDeserialized, PreKeyDeserialized } from '../Types/PreKey';

export class SessionEntry implements SessionDeserialized {
    registrationId: string;
    currentRatchet: {
        ephemeralKeyPair: EphemeralKeyPairDeserialized
        lastRemoteEphemeralKey: Buffer;
        previousCounter: number;
        rootKey: Buffer;
    };
    indexInfo: {
        baseKey: Buffer;
        baseKeyType: BaseKeyType;
        closed: number;
        used: number;
        created: number;
        remoteIdentityKey: Buffer;
    };
    _chains: ChainsDeserialized;
    pendingPreKey?: PendingPreKeyDeserialized

    constructor() {
        this.registrationId = '';
        this.currentRatchet = {
            ephemeralKeyPair: {
                pubKey: Buffer.alloc(0),
                privKey: Buffer.alloc(0)
            },
            lastRemoteEphemeralKey: Buffer.alloc(0),
            previousCounter: 0,
            rootKey: Buffer.alloc(0)
        };
        this.indexInfo = {
            baseKey: Buffer.alloc(0),
            baseKeyType: BaseKeyType.THEIRS,
            closed: 0,
            used: 0,
            created: 0,
            remoteIdentityKey: Buffer.alloc(0)
        };
        this._chains = {};
        this.pendingPreKey = undefined;
    }

    toString(): string {
        const baseKey = this.indexInfo && this.indexInfo.baseKey &&
            this.indexInfo.baseKey.toString('base64');
        return `<SessionEntry [baseKey=${baseKey}]>`;
    }

    inspect(): string {
        return this.toString();
    }

    addChain(key: Buffer | Uint8Array, value: any): void {
        const id = key.toString('base64');
        if (this._chains.hasOwnProperty(id)) {
            throw new Error("Overwrite attempt");
        }
        this._chains[id] = value;
    }

    getChain(key: Buffer | Uint8Array): ChainDeserialized {
        return this._chains[key.toString('base64')];
    }

    deleteChain(key: Buffer | Uint8Array): void {
        const id = key.toString('base64');
        if (!this._chains.hasOwnProperty(id)) {
            throw new ReferenceError("Not Found");
        }
        delete this._chains[id];
    }

    *chains(): IterableIterator<[Buffer, ChainDeserialized]> {
        for (const [k, v] of Object.entries(this._chains)) {
            yield [Buffer.from(k, 'base64'), v];
        }
    }

    serialize(): SessionSerialized {
        const data: SessionSerialized = {
            registrationId: this.registrationId,
            currentRatchet: {
                ephemeralKeyPair: {
                    pubKey: this.currentRatchet!.ephemeralKeyPair!.pubKey.toString('base64'),
                    privKey: this.currentRatchet!.ephemeralKeyPair!.privKey.toString('base64')
                },
                lastRemoteEphemeralKey: this.currentRatchet!.lastRemoteEphemeralKey!.toString('base64'),
                previousCounter: this.currentRatchet!.previousCounter,
                rootKey: this.currentRatchet!.rootKey.toString('base64')
            },
            indexInfo: {
                baseKey: this.indexInfo!.baseKey.toString('base64'),
                baseKeyType: this.indexInfo!.baseKeyType,
                closed: this.indexInfo!.closed,
                used: this.indexInfo!.used,
                created: this.indexInfo!.created,
                remoteIdentityKey: this.indexInfo!.remoteIdentityKey.toString('base64')
            },
            _chains: this._serialize_chains(this._chains)
        };
        if (this.pendingPreKey) {
            data.pendingPreKey = {}
            data.pendingPreKey.baseKey = this.pendingPreKey.baseKey?.toString('base64');
        }
        return data;
    }

    static deserialize(data: SessionSerialized): SessionEntry {
        const obj = new this();
        obj.registrationId = data.registrationId;
        obj.currentRatchet = {
            ephemeralKeyPair: {
                pubKey: Buffer.from(data.currentRatchet.ephemeralKeyPair.pubKey, 'base64'),
                privKey: Buffer.from(data.currentRatchet.ephemeralKeyPair.privKey, 'base64')
            },
            lastRemoteEphemeralKey: Buffer.from(data.currentRatchet.lastRemoteEphemeralKey, 'base64'),
            previousCounter: data.currentRatchet.previousCounter,
            rootKey: Buffer.from(data.currentRatchet.rootKey, 'base64')
        };
        obj.indexInfo = {
            baseKey: Buffer.from(data.indexInfo.baseKey, 'base64'),
            baseKeyType: data.indexInfo.baseKeyType,
            closed: data.indexInfo.closed,
            used: data.indexInfo.used,
            created: data.indexInfo.created,
            remoteIdentityKey: Buffer.from(data.indexInfo.remoteIdentityKey, 'base64')
        };
        obj._chains = this._deserialize_chains(data._chains);
        if (data.pendingPreKey) {
            obj.pendingPreKey = {}
            obj.pendingPreKey.baseKey = Buffer.from(data.pendingPreKey.baseKey!, 'base64');
        }
        return obj;
    }

    private _serialize_chains(chains: ChainsDeserialized){
        const r: ChainsSerialized = {};
        for (const key of Object.keys(chains)) {
            const c = chains[key];
            const messageKeys: any = {};
            for (const [idx, key] of Object.entries(c.messageKeys)) {
                messageKeys[idx] = (key as Buffer).toString('base64');
            }
            r[key] = {
                chainKey: {
                    counter: c.chainKey.counter,
                    key: c.chainKey.key && c.chainKey.key.toString('base64')
                },
                chainType: c.chainType,
                messageKeys: messageKeys
            };
        }
        return r;
    }

    private static _deserialize_chains(chains_data: ChainsSerialized) {
        const r: ChainsDeserialized = {};
        for (const key of Object.keys(chains_data)) {
            const c = chains_data[key];
            const messageKeys: any = {};
            for (const [idx, key] of Object.entries(c.messageKeys)) {
                messageKeys[idx] = Buffer.from(key as string, 'base64');
            }
            r[key] = {
                chainKey: {
                    counter: c.chainKey.counter,
                    key: c.chainKey.key && Buffer.from(c.chainKey.key, 'base64')
                },
                chainType: c.chainType,
                messageKeys: messageKeys
            };
        }
        return r;
    }
}
