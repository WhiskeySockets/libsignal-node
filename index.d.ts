interface E2ESession {
  registrationId: number;
  identityKey: Uint8Array;
  signedPreKey: {
    keyId: number;
    publicKey: Uint8Array;
    signature: Uint8Array;
  };
  preKey: {
    keyId: number;
    publicKey: Uint8Array;
  };
}

export interface ILogger {
  info(obj?: any, msg?: string): void;
  warn(obj?: any, msg?: string): void;
  error(obj?: any, msg?: string): void;
  debug(obj?: any, msg?: string): void;
  trace(obj?: any, msg?: string): void;
}

export interface SignalStorage {
  loadSession(id: string): Promise<SessionRecord | null | undefined>;
  storeSession(id: string, session: SessionRecord): Promise<void>;
  isTrustedIdentity(
    identifier: string,
    identityKey: Uint8Array,
    direction: number
  ): boolean;
  loadPreKey(
    id: number | string
  ): Promise<{ privKey: Buffer; pubKey: Buffer } | undefined>;
  removePreKey(id: number): void;
  loadSignedPreKey(): { privKey: Buffer; pubKey: Buffer };
  getOurRegistrationId(): Promise<number> | number;
  getOurIdentity(): { privKey: Buffer; pubKey: Buffer };
}

export class ProtocolAddress {
  constructor(name: string, deviceId: number);
  public getName(): string;
  public getDeviceId(): number;
  public toString(): string;
}

export class SessionRecord {
  static deserialize(serialized: Uint8Array): SessionRecord;
  public serialize(): Uint8Array;
  public haveOpenSession(): boolean;
}

export class SessionCipher {
  constructor(storage: SignalStorage, remoteAddress: ProtocolAddress, logger?: ILogger);
  public decryptPreKeyWhisperMessage(ciphertext: Uint8Array): Promise<Buffer>;
  public decryptWhisperMessage(ciphertext: Uint8Array): Promise<Buffer>;
  public encrypt(data: Uint8Array): Promise<{ type: number; body: string }>;
}

export class SessionBuilder {
  constructor(storage: SignalStorage, remoteAddress: ProtocolAddress, logger?: ILogger);
  public initOutgoing(session: E2ESession): Promise<void>;
}
