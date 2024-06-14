export class SignalError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = 'SignalError';
    }
}
  
export class UntrustedIdentityKeyError extends SignalError {
    addr: string;
    identityKey: string;

    constructor(addr: string, identityKey: any) {
        super();
        this.name = 'UntrustedIdentityKeyError';
        this.addr = addr;
        this.identityKey = identityKey;
    }
}

export class SessionError extends SignalError {
    constructor(message: string) {
        super(message);
        this.name = 'SessionError';
    }
}

export class MessageCounterError extends SessionError {
    constructor(message: string) {
        super(message);
        this.name = 'MessageCounterError';
    }
}
  
export class PreKeyError extends SessionError {
    constructor(message: string) {
        super(message);
        this.name = 'PreKeyError';
    }
}
