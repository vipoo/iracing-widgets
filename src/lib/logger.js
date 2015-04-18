import winston from 'winston';
import moment from 'moment';
import config from 'lib/config';
import cloudWatchLogger from 'lib/cloudWatchLogger';

function createLogger(name, filename, withConsole) {
  var transports = [
    new (winston.transports.File)({filename: filename + '.' + config.nodeEnv() + '.log', json:false, maxsize: 1000000, maxFiles: 4, tailable: true})
  ]

  if (config.isAws())
    transports.push(new cloudWatchLogger({
      logGroupName: 'widgets',
      logStreamName: name,
      region: 'ap-southeast-2' }))

  if (withConsole)
    transports.push(new winston.transports.Console({colorize: true, prettyPrint: true}))

  return new winston.Logger({ transports })
}

var outLogger = createLogger('app', 'log/app', config.isDevelopment())
var errLogger = createLogger('error', 'log/app.err', config.isDevelopment() || config.isTest())
var accessLogger = createLogger('access', 'log/access', config.isDevelopment() || config.isTest())

/*eslint-disable no-undef */
GLOBAL.$logger = {
  access: function() {
    accessLogger.info.apply(null, arguments)
  },

  info: function() {
    outLogger.info.apply(null, arguments)
  },

  debug: function() {
    outLogger.debug.apply(null, arguments)
  },

  error: function() {
    errLogger.error.apply(null, arguments)
  }
}
/*eslint-enable no-undef */
