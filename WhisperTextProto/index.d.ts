import * as $protobuf from "protobufjs";
/** Namespace textsecure. */
export namespace textsecure {

    /** Properties of a WhisperMessage. */
    interface IWhisperMessage {

        /** WhisperMessage ephemeralKey */
        ephemeralKey?: (Uint8Array|null);

        /** WhisperMessage counter */
        counter?: (number|null);

        /** WhisperMessage previousCounter */
        previousCounter?: (number|null);

        /** WhisperMessage ciphertext */
        ciphertext?: (Uint8Array|null);
    }

    /** Represents a WhisperMessage. */
    class WhisperMessage implements IWhisperMessage {

        /**
         * Constructs a new WhisperMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: textsecure.IWhisperMessage);

        /** WhisperMessage ephemeralKey. */
        public ephemeralKey: Uint8Array;

        /** WhisperMessage counter. */
        public counter: number;

        /** WhisperMessage previousCounter. */
        public previousCounter: number;

        /** WhisperMessage ciphertext. */
        public ciphertext: Uint8Array;

        /**
         * Creates a new WhisperMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WhisperMessage instance
         */
        public static create(properties?: textsecure.IWhisperMessage): textsecure.WhisperMessage;

        /**
         * Encodes the specified WhisperMessage message. Does not implicitly {@link textsecure.WhisperMessage.verify|verify} messages.
         * @param message WhisperMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: textsecure.IWhisperMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WhisperMessage message, length delimited. Does not implicitly {@link textsecure.WhisperMessage.verify|verify} messages.
         * @param message WhisperMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: textsecure.IWhisperMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WhisperMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): textsecure.WhisperMessage;

        /**
         * Decodes a WhisperMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): textsecure.WhisperMessage;

        /**
         * Verifies a WhisperMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WhisperMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WhisperMessage
         */
        public static fromObject(object: { [k: string]: any }): textsecure.WhisperMessage;

        /**
         * Creates a plain object from a WhisperMessage message. Also converts values to other types if specified.
         * @param message WhisperMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: textsecure.WhisperMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WhisperMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PreKeyWhisperMessage. */
    interface IPreKeyWhisperMessage {

        /** PreKeyWhisperMessage registrationId */
        registrationId?: (number|null);

        /** PreKeyWhisperMessage preKeyId */
        preKeyId?: (number|null);

        /** PreKeyWhisperMessage signedPreKeyId */
        signedPreKeyId?: (number|null);

        /** PreKeyWhisperMessage baseKey */
        baseKey?: (Uint8Array|null);

        /** PreKeyWhisperMessage identityKey */
        identityKey?: (Uint8Array|null);

        /** PreKeyWhisperMessage message */
        message?: (Uint8Array|null);
    }

    /** Represents a PreKeyWhisperMessage. */
    class PreKeyWhisperMessage implements IPreKeyWhisperMessage {

        /**
         * Constructs a new PreKeyWhisperMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: textsecure.IPreKeyWhisperMessage);

        /** PreKeyWhisperMessage registrationId. */
        public registrationId: number;

        /** PreKeyWhisperMessage preKeyId. */
        public preKeyId: number;

        /** PreKeyWhisperMessage signedPreKeyId. */
        public signedPreKeyId: number;

        /** PreKeyWhisperMessage baseKey. */
        public baseKey: Uint8Array;

        /** PreKeyWhisperMessage identityKey. */
        public identityKey: Uint8Array;

        /** PreKeyWhisperMessage message. */
        public message: Uint8Array;

        /**
         * Creates a new PreKeyWhisperMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PreKeyWhisperMessage instance
         */
        public static create(properties?: textsecure.IPreKeyWhisperMessage): textsecure.PreKeyWhisperMessage;

        /**
         * Encodes the specified PreKeyWhisperMessage message. Does not implicitly {@link textsecure.PreKeyWhisperMessage.verify|verify} messages.
         * @param message PreKeyWhisperMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: textsecure.IPreKeyWhisperMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PreKeyWhisperMessage message, length delimited. Does not implicitly {@link textsecure.PreKeyWhisperMessage.verify|verify} messages.
         * @param message PreKeyWhisperMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: textsecure.IPreKeyWhisperMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PreKeyWhisperMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PreKeyWhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): textsecure.PreKeyWhisperMessage;

        /**
         * Decodes a PreKeyWhisperMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PreKeyWhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): textsecure.PreKeyWhisperMessage;

        /**
         * Verifies a PreKeyWhisperMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PreKeyWhisperMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PreKeyWhisperMessage
         */
        public static fromObject(object: { [k: string]: any }): textsecure.PreKeyWhisperMessage;

        /**
         * Creates a plain object from a PreKeyWhisperMessage message. Also converts values to other types if specified.
         * @param message PreKeyWhisperMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: textsecure.PreKeyWhisperMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PreKeyWhisperMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KeyExchangeMessage. */
    interface IKeyExchangeMessage {

        /** KeyExchangeMessage id */
        id?: (number|null);

        /** KeyExchangeMessage baseKey */
        baseKey?: (Uint8Array|null);

        /** KeyExchangeMessage ephemeralKey */
        ephemeralKey?: (Uint8Array|null);

        /** KeyExchangeMessage identityKey */
        identityKey?: (Uint8Array|null);

        /** KeyExchangeMessage baseKeySignature */
        baseKeySignature?: (Uint8Array|null);
    }

    /** Represents a KeyExchangeMessage. */
    class KeyExchangeMessage implements IKeyExchangeMessage {

        /**
         * Constructs a new KeyExchangeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: textsecure.IKeyExchangeMessage);

        /** KeyExchangeMessage id. */
        public id: number;

        /** KeyExchangeMessage baseKey. */
        public baseKey: Uint8Array;

        /** KeyExchangeMessage ephemeralKey. */
        public ephemeralKey: Uint8Array;

        /** KeyExchangeMessage identityKey. */
        public identityKey: Uint8Array;

        /** KeyExchangeMessage baseKeySignature. */
        public baseKeySignature: Uint8Array;

        /**
         * Creates a new KeyExchangeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyExchangeMessage instance
         */
        public static create(properties?: textsecure.IKeyExchangeMessage): textsecure.KeyExchangeMessage;

        /**
         * Encodes the specified KeyExchangeMessage message. Does not implicitly {@link textsecure.KeyExchangeMessage.verify|verify} messages.
         * @param message KeyExchangeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: textsecure.IKeyExchangeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyExchangeMessage message, length delimited. Does not implicitly {@link textsecure.KeyExchangeMessage.verify|verify} messages.
         * @param message KeyExchangeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: textsecure.IKeyExchangeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyExchangeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyExchangeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): textsecure.KeyExchangeMessage;

        /**
         * Decodes a KeyExchangeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyExchangeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): textsecure.KeyExchangeMessage;

        /**
         * Verifies a KeyExchangeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyExchangeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyExchangeMessage
         */
        public static fromObject(object: { [k: string]: any }): textsecure.KeyExchangeMessage;

        /**
         * Creates a plain object from a KeyExchangeMessage message. Also converts values to other types if specified.
         * @param message KeyExchangeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: textsecure.KeyExchangeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyExchangeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
