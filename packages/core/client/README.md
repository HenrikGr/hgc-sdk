# @hgc-sdk/logger

Logging can be enabled in the following ways:

- Setting the SERVICE_LOG_LEVEL environment variable
- Calling setLogLevel
- Calling enable() on specific loggers
- Using the `DEBUG` environment variable.

Note that SERVICE_LOG_LEVEL, if set, takes precedence over DEBUG.
Only use DEBUG without specifying SERVICE_LOG_LEVEL or calling setLogLevel.

## Key Concepts

The supports the following log levels specified in order of most verbose to least verbose:

- verbose
- info
- warning
- error

When setting a log level, either programmatically or via the SERVICE_LOG_LEVEL environment
variable, any logs that are written using a log level equal to or less than the one you
choose will be emitted.

For example, setting the log level to `warning` will cause all logs that have the log
level `warning` or `error` to be emitted.

## Examples

### Example 1 - require or import

```js
const logger = require('@hgc-sdk/logger')
const { createClientLogger, ServiceLogger, setLogLevel, getLogLevel } = logger

or

import * as logger from '@hgc-sdk/logger'
const { createClientLogger, ServiceLogger, setLogLevel, getLogLevel } = logger

or

import { createClientLogger, ServiceLogger, setLogLevel, getLogLevele } from '@hgc-sdk/logger'
```

### Example 2 - Create loggers

```js
import { createClientLogger } from '@hgc-sdk/logger'
const myLogger = createClientLogger(namespace)

myLogger.error('Error message')
myLogger.info('Information message')
myLogger.warning('warning message')

```

### Example 3 - change log level dynamically for all registered loggers

```js
import { createClientLogger, ServiceLogger, setLogLevel, getLogLevele } from '@hgc-sdk/logger'
const { error, warning, info, verbose } = createClientLogger(namespace)

const checkLogLevel = getLogLevel()
// verbose is current log level

error('error message')      // logs
warning('warning message')  // logs
info('information message') // logs
verbose('verbose message')  // logs

setLogLevel('error')

error('error message')      // logs
warning('warning message')  // do not log
info('information message') // do not log
verbose('verbose message')  // do not log
```

### Example 4 - redirect where registered loggers will output their messages

```js
import { ServiceLogger } from '@hgc-sdk/logger'

ServiceLogger.log = outputFunction
// All registered and enabled loggers will now log to the outputFunction
```

