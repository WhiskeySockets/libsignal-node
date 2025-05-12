// vim: ts=4:sw=4:expandtab
 
 /*
  * jobQueue manages multiple queues indexed by device to serialize
  * session io ops on the database.
  */
'use strict';


const _queueAsyncBuckets = new Map(); 
const _gcLimit = 10000;

/* 
* This is a wrapper around the async function that will reject if it
* takes longer than the specified timeout.  This is useful for
* preventing a job from hanging indefinitely.  The default timeout
* is 30 seconds.
*/
function withTimeout(fn, ms = 15000) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn must be a function to wrap received ' + typeof fn);
    }
    if (typeof ms !== 'number') {
        throw new TypeError('ms must be a number to wrap received ' + typeof ms);
    }
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Job timed out')), ms);
        fn().then((res) => {
            clearTimeout(timer);
            resolve(res);
        }).catch((err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

async function _asyncQueueExecutor(queue, cleanup) {
    let offt = 0;
    while (true) {
        let limit = Math.min(queue.length, _gcLimit); // Break up thundering hurds for GC duty.
        for (let i = offt; i < limit; i++) {
            const job = queue[i];
            try {
                // tricky hehe
                job.resolve(await withTimeout(job.awaitable, 15000)); // if the job takes longer than 15 seconds, it will be rejected
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


module.exports = function(bucket, awaitable) {
    /* Run the async awaitable only when all other async calls registered
     * here have completed (or thrown).  The bucket argument is a hashable
     * key representing the task queue to use. */
    if (!awaitable.name) {
        // Make debuging easier by adding a name to this function.
        Object.defineProperty(awaitable, 'name', {writable: true});
        if (typeof bucket === 'string') {
            awaitable.name = bucket;
        } else {
            console.warn("Unhandled bucket type (for naming):", typeof bucket, bucket);
        }
    }
    let inactive;
    if (!_queueAsyncBuckets.has(bucket)) {
        _queueAsyncBuckets.set(bucket, []);
        inactive = true;
    }
    const queue = _queueAsyncBuckets.get(bucket);
    const job = new Promise((resolve, reject) => queue.push({
        awaitable,
        resolve,
        reject
    }));
    if (inactive) {
        /* An executor is not currently active; Start one now. */
        _asyncQueueExecutor(queue, () => _queueAsyncBuckets.delete(bucket));
    }
    return job;
};
