import { CLOSED_SESSIONS_MAX, SESSION_RECORD_VERSION } from '../Types/constants'
import { SessionSerializedList, Migration, SessionRecordList } from '../Types/Session'
import { BaseKeyType } from '../Types/BaseKey'
import { SessionEntry } from './session-entry'

const migrations: Migration[] = [{
    version: 'v1',
    migrate: function migrateV1(data: SessionRecordList) {
        const sessions = data._sessions
        if (data.registrationId) {
            for (const key in sessions) {
                if (!sessions[key].registrationId) {
                    sessions[key].registrationId = data.registrationId
                }
            }
        } else {
            for (const key in sessions) {
                if (sessions[key].indexInfo.closed === -1) {
                    console.error(
                        'V1 session storage migration error: registrationId',
                        data.registrationId, 'for open session version',
                        data.version
                    )
                }
            }
        }
    }
}]

export class SessionRecord {
    private sessions: { [key: string]: SessionEntry }
    private version: string

    constructor() {
        this.sessions = {}
        this.version = SESSION_RECORD_VERSION
    }

    static createEntry(): SessionEntry {
        return new SessionEntry()
    }

    static migrate(data: any): void {
        let run: boolean = data.version === undefined
        for (let i = 0; i < migrations.length; ++i) {
            if (run) {
                console.info("Migrating session to:", migrations[i].version)
                migrations[i].migrate(data)
            } else if (migrations[i].version === data.version) {
                run = true
            }
        }
        if (!run) {
            throw new Error("Error migrating SessionRecord")
        }
    }

    static deserialize(data: SessionRecordList): SessionRecord {
        if (data.version !== SESSION_RECORD_VERSION) {
            this.migrate(data)
        }
        const obj = new this()
        if (data._sessions) {
            for (const [key, entry] of Object.entries(data._sessions)) {
                obj.sessions[key] = SessionEntry.deserialize(entry)
            }
        }
        return obj
    }

    serialize(): SessionRecordList {
        const _sessions: SessionSerializedList = {}
        for (const [key, entry] of Object.entries(this.sessions)) {
            _sessions[key] = entry.serialize()
        }
        return {
            _sessions,
            version: this.version
        }
    }

    haveOpenSession(): boolean {
        const openSession = this.getOpenSession()
        return (!!openSession && typeof openSession.registrationId === 'number')
    }

    getSession(key: Buffer): SessionEntry {
        const session = this.sessions[key.toString('base64')]
        if (session && session.indexInfo.baseKeyType === BaseKeyType.OURS) {
            throw new Error("Tried to lookup a session using our basekey")
        }
        return session
    }

    getOpenSession(): SessionEntry | void {
        for (const session of Object.values(this.sessions)) {
            if (!this.isClosed(session)) {
                return session
            }
        }
    }

    setSession(session: SessionEntry): void {
        this.sessions[session.indexInfo.baseKey.toString('base64')] = session
    }

    getSessions(): SessionEntry[] {
        // Return sessions ordered with most recently used first.
        return Array.from(Object.values(this.sessions)).sort((a, b) => {
            const aUsed = a.indexInfo.used || 0
            const bUsed = b.indexInfo.used || 0
            return aUsed === bUsed ? 0 : aUsed < bUsed ? 1 : -1
        })
    }

    closeSession(session: SessionEntry): void {
        if (this.isClosed(session)) {
            console.warn("Session already closed", session)
            return
        }
        console.info("Closing session:", session)
        session.indexInfo.closed = Date.now()
    }

    openSession(session: SessionEntry): void {
        if (!this.isClosed(session)) {
            console.warn("Session already open")
        }
        console.info("Opening session:", session)
        session.indexInfo.closed = -1
    }

    isClosed(session: SessionEntry): boolean {
        return session.indexInfo.closed !== -1
    }

    removeOldSessions(): void {
        while (Object.keys(this.sessions).length > CLOSED_SESSIONS_MAX) {
            let oldestKey: string | undefined
            let oldestSession: SessionEntry | undefined
            for (const [key, session] of Object.entries(this.sessions)) {
                if (session.indexInfo.closed !== -1 &&
                    (!oldestSession || session.indexInfo.closed < oldestSession.indexInfo.closed)) {
                    oldestKey = key
                    oldestSession = session
                }
            }
            if (oldestKey) {
                console.info("Removing old closed session:", oldestSession)
                delete this.sessions[oldestKey]
            } else {
                throw new Error('Corrupt sessions object')
            }
        }
    }

    deleteAllSessions(): void {
        for (const key of Object.keys(this.sessions)) {
            delete this.sessions[key]
        }
    }
}
