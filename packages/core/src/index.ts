/**
 * Core logger module
 */
import * as logger from './logger'
const { ServiceLogger, createClientLogger, setLogLevel, getLogLevel } = logger

export default logger
export {
    ServiceLogger, createClientLogger, setLogLevel, getLogLevel
}
