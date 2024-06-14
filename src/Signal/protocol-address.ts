export class ProtocolAddress {
    id: string
    deviceId: number

    constructor(id: string, deviceId: number) {
        if (typeof id !== 'string') {
            throw new TypeError('id required for addr')
        }
        if (id.indexOf('.') !== -1) {
            throw new TypeError('encoded addr detected')
        }
        if (typeof deviceId !== 'number' || isNaN(deviceId)) {
            throw new TypeError('number required for deviceId')
        }

        this.id = id
        this.deviceId = deviceId
    }

    static from(encodedAddress: string): ProtocolAddress {
        if (typeof encodedAddress !== 'string' || !encodedAddress.match(/.*\.\d+/)) {
            throw new Error('Invalid address encoding')
        }

        const parts = encodedAddress.split('.')
        return new this(parts[0], parseInt(parts[1], 10))
    }

    toString(): string {
        return `${this.id}.${this.deviceId}`
    }

    is(other: ProtocolAddress): boolean {
        if (!(other instanceof ProtocolAddress)) {
            return false
        }

        return other.id === this.id && other.deviceId === this.deviceId;
    }
}
