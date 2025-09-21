const { pino } = require('pino');

/**
 * This function returns the log level for the loggers based on
 * environment variables. To silence the libsignal logs, just set an env var
 * LIBSIGNAL_LOG_LEVEL=silent
 *
 * @returns {string} - The default log level.
 */
const getDefaultLogLevel = () => {
    const isDebug = process.env.DEBUG || process.env.NODE_ENV === 'development';

    if (isDebug) {
        return 'debug';
    }

    const hasLibsignalLogLevel = process.env.LIBSIGNAL_LOG_LEVEL;

    if (hasLibsignalLogLevel) {
        return process.env.LIBSIGNAL_LOG_LEVEL;
    }

    return process.env.LOG_LEVEL || 'info';
};

const baseConfig = {
    level: getDefaultLogLevel()
};

const getLoggerConfig =
    process.env.NODE_ENV !== 'production'
        ? {
              transport: {
                  target: 'pino-pretty',
                  level: 'debug',
                  options: {
                      singleLine: true,
                      colorize: true,
                      colorizeObjects: true,
                      ignore: 'hostname,pid',
                      messageKey: 'message'
                  }
              }
          }
        : {};

const baseLogger = pino(
    Object.assign({}, baseConfig, getLoggerConfig, {
        messageKey: 'message'
    })
);

/**
 * LoggerService is a class that provides a logger for a given service.
 * @param {string} serviceName - The name of the service to log.
 * @param {object} options - The options for the logger.
 * @param {string[]} options.ignoredContexts - The contexts to ignore.
 * @param {string[]} options.allowedErrorLogLevels - The levels to log as errors.
 * @param {string[]} options.unignoredLevels - The levels to log as errors.
 *
 * @returns {LoggerService} - Logger instance
 */
class LoggerService {
    constructor(serviceName = 'libsignal-node', options = {}) {
        this.logger = baseLogger.child({
            serviceName
        });

        this.MAX_ERROR_DEPTH = 3;
        this.ignoredContexts = options.ignoredContexts || [];
        this.allowedErrorLogLevels = options.allowedErrorLogLevels || ['error', 'warn'];
        this.unignoredLevels = options.unignoredLevels || ['error', 'warn'];
    }

    /**
     * Since pino doesn't log errors properly, we format the error object
     * to a more readable format.
     * @param {*} error
     * @returns
     */
    formatError(error) {
        const { message, name, stack } = error;
        const rest = {};

        for (const key in error) {
            if (key !== 'message' && key !== 'name' && key !== 'stack') {
                rest[key] = error[key];
            }
        }

        return {
            error: Object.assign(
                {
                    name,
                    message,
                    stack
                },
                rest
            )
        };
    }

    /**
     * Processes an object and its nested objects to log errors properly.
     * @param {object} obj - The object to process.
     * @param {number} depth - The depth of the object.
     * @returns {object} - The processed object.
     */
    processErrorsInObject(obj, depth = 0) {
        if (obj === null || obj === undefined) {
            return obj;
        }

        if (depth >= this.MAX_ERROR_DEPTH) {
            return obj;
        }

        if (obj instanceof Error) {
            return this.formatError(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.processErrorsInObject(item, depth + 1));
        }

        if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
            return Object.entries(obj).reduce((result, [key, value]) => {
                result[key] = this.processErrorsInObject(value, depth + 1);
                return result;
            }, {});
        }

        return obj;
    }

    /**
     * Logs a message with a given level.
     * @param {string} level - The level of the message.
     * @param {string} msg - The message to log.
     * @param {object} obj - The object to log.
     * @param {...*} args - The arguments to log.
     */
    logWithLevel(level, msg, obj, ...args) {
        const processedObj =
            this.allowedErrorLogLevels.includes(level) &&
            obj !== null &&
            typeof obj === 'object' &&
            obj.constructor === Object
                ? this.processErrorsInObject(obj)
                : obj != null
                ? obj
                : undefined;

        const processedArgs = this.allowedErrorLogLevels.includes(level)
            ? args.map((arg) => this.processErrorsInObject(arg))
            : args;

        if (processedObj === undefined) {
            this.logger[level](msg, ...processedArgs);
        } else if (typeof obj === 'string') {
            if (this.ignoredContexts.includes(obj) && !this.unignoredLevels.includes(level)) {
                return;
            }

            this.logger[level]({ $context: obj }, msg, ...processedArgs);
        } else {
            this.logger[level](processedObj, msg, ...processedArgs);
        }
    }

    /**
     * Logs an info message.
     * @param {string} message - The message to log.
     * @param {object} data - The data to log.
     */
    info(message, data) {
        this.logWithLevel('info', message, data);
    }

    /**
     * Logs an error message.
     * @param {string} message - The message to log.
     * @param {object} data - The data to log.
     */
    error(message, data) {
        this.logWithLevel('error', message, data);
    }

    /**
     * Logs a warning message.
     * @param {string} message - The message to log.
     * @param {object} data - The data to log.
     */
    warn(message, data) {
        this.logWithLevel('warn', message, data);
    }

    /**
     * Logs a debug message.
     * @param {string} message - The message to log.
     * @param {object} data - The data to log.
     */
    debug(message, data) {
        this.logWithLevel('debug', message, data);
    }
}

const createLogger = (loggerName = 'libsignal-node') => {
    return new LoggerService(loggerName);
};

module.exports = {
    createLogger
};
