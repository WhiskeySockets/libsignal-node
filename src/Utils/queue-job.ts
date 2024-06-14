interface QueueJob<T> {
    awaitable: () => Promise<T>
    resolve: (value?: T | PromiseLike<T>) => void
    reject: (reason?: any) => void
}

const _queueAsyncBuckets: Map<string, QueueJob<any>[]> = new Map();
const _gcLimit = 10000;

async function _asyncQueueExecutor(queue: QueueJob<any>[], cleanup: () => void) {
    let offt = 0;
    while (true) {
        let limit = Math.min(queue.length, _gcLimit); // Break up thundering hurds for GC duty.
        for (let i = offt; i < limit; i++) {
            const job = queue[i];
            try {
                job.resolve(await job.awaitable());
            } catch(e) {
                job.reject(e);
            }
        }
        if (limit < queue.length) {
            /* Perform lazy GC of queue for faster iteration. */
            if (limit >= _gcLimit) {
                queue.splice(0, limit);
                offt = 0;
            } else {
                offt = limit;
            }
        } else {
            break;
        }
    }
    cleanup();
}

/** queueJob manages multiple queues indexed by device to serialize session io ops on the database.
 * 
 * Run the async awaitable only when all other async calls registered
 * here have completed (or thrown).  The bucket argument is a hashable
 * key representing the task queue to use.
*/
export function queueJob<T>(bucket: string, awaitable: () => Promise<T>): Promise<T> {
    let inactive;
    if (!_queueAsyncBuckets.has(bucket)) {
        _queueAsyncBuckets.set(bucket, [])
        inactive = true
    }
    const queue = _queueAsyncBuckets.get(bucket)
    const job = new Promise<T>((resolve, reject) => queue?.push({
        awaitable,
        resolve,
        reject
    }))
    if (inactive && queue) {
        /* An executor is not currently active; Start one now. */
        _asyncQueueExecutor(queue, () => _queueAsyncBuckets.delete(bucket))
    }
    return job
};
