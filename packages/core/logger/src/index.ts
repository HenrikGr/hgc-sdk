import debug, { Debugger } from 'debug'
//export { Debugger } from 'debug'

/**
 * The ServiceLogger provides a mechanism for overriding where logs are output to.
 * By default, logs are sent to stderr. Override the `log` method to redirect logs
 * to another location.
 */
export const ServiceLogger: ServiceClientLogger = debug('@hgc-ab')
ServiceLogger.log = (...args) => {
    debug.log(...args)
}

/**
 * An ServiceClientLogger is a function that can log to an appropriate severity level.
 */
export type ServiceClientLogger = Debugger;

/**
 * The log levels supported by the logger.
 * The log levels in order of most verbose to least verbose are:
 * - verbose
 * - info
 * - warning
 * - error
 */
export type ServiceLogLevel = 'verbose' | 'info' | 'warning' | 'error'

/**
 * Defines the methods available on the SDK-facing logger.
 */
export interface ServiceLogger {
    /**
     * Used for failures the program is unlikely to recover from,
     * such as Out of Memory.
     */
    error: ServiceDebugger;
    /**
     * Used when a function fails to perform its intended task.
     * Usually this means the function will throw an exception.
     * Not used for self-healing events (e.g. automatic retry)
     */
    warning: ServiceDebugger;
    /**
     * Used when a function operates normally.
     */
    info: ServiceDebugger;
    /**
     * Used for detailed troubleshooting scenarios. This is
     * intended for use by developers / system administrators
     * for diagnosing specific failures.
     */
    verbose: ServiceDebugger;
}

/**
 * Interface of a  Map of log levels supported
 */
interface LevelMap {
    [index: string]: number
}

const SERVICE_LOG_LEVELS = ['verbose', 'info', 'warning', 'error']
const levelMap: LevelMap = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100,
}

type ServiceDebugger = Debugger & { level: ServiceLogLevel };

const registeredLoggers = new Set<ServiceDebugger>()
let serviceLogLevel: ServiceLogLevel | undefined

/**
 * Read log level from SERVICE_LOG_LEVEL environment
 */
readServiceLogLevelFromEnv()

/**
 * Set log level to all registered loggers
 * @param level
 */
export function setLogLevel(level?: ServiceLogLevel): void {
    if (level && !isServiceLogLevel(level)) {
        throw new Error(
            `Unknown log level \'${level}\'. Acceptable values: ${SERVICE_LOG_LEVELS.join(",")}`
        );
    }

    serviceLogLevel = level;

    const enabledNamespaces = [];
    for (const logger of registeredLoggers) {
        if (shouldEnableLogger(logger)) {
            enabledNamespaces.push(logger.namespace);
        }
    }

    debug.enable(enabledNamespaces.join(","));
}

/**
 * Retrieves the currently specified log level.
 */
export function getLogLevel(): ServiceLogLevel | undefined {
    return serviceLogLevel;
}

/**
 * Creates a logger for use by the SDKs that inherits from `ServiceLogger`.
 * @param namespace - The namespace
 */
export function createClientLogger(namespace: string): ServiceLogger {
    const rootLogger = ServiceLogger.extend(`${namespace}`)
    patchLogMethod(ServiceLogger, rootLogger);
    return {
        verbose: createLogger(rootLogger, 'verbose'),
        info: createLogger(rootLogger, 'info'),
        warning: createLogger(rootLogger, 'warning'),
        error: createLogger(rootLogger, 'error'),
    }
}

/**
 * Create a logger instance
 * @param rootLogger
 * @param level
 */
function createLogger(rootLogger: ServiceClientLogger, level: ServiceLogLevel): ServiceDebugger {
    const logger = Object.assign(rootLogger.extend(level), { level });
    patchLogMethod(rootLogger, logger)

    if (shouldEnableLogger(logger)) {
        const enabledNamespaces = debug.disable()
        debug.enable(enabledNamespaces + ',' + logger.namespace)
    }

    // Set logger as registered
    registeredLoggers.add(logger)

    return logger
}

function patchLogMethod(parent: ServiceClientLogger, child: ServiceClientLogger): void {
    child.log = (...args) => {
        parent.log(...args);
    };
}

function shouldEnableLogger(logger: ServiceDebugger): boolean {
    return !!(serviceLogLevel && levelMap[logger.level] <= levelMap[serviceLogLevel]);
}

function isServiceLogLevel(logLevel: string): logLevel is ServiceLogLevel {
    return SERVICE_LOG_LEVELS.includes(logLevel as any)
}

function readServiceLogLevelFromEnv() {
    const logLevelFromEnv =
        (typeof process !== "undefined" && process.env && process.env.SERVICE_LOG_LEVEL) || undefined;

    if (logLevelFromEnv) {
        if (isServiceLogLevel(logLevelFromEnv)) {
            setLogLevel(logLevelFromEnv);
        } else {
            console.error(
                `SERVICE_LOG_LEVEL set to unknown log level \'${logLevelFromEnv}\'; logging is not enabled. Acceptable values: ${SERVICE_LOG_LEVELS.join(
                    ", "
                )}.`
            );
        }
    }
}
