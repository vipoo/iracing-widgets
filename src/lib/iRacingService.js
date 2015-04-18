import request from 'request';
import when from 'when';
import fs from 'fs';
import config from 'lib/config';
import guard from 'when/guard';
import https from 'https';

const host = config.hostPrefix()

var pool = new https.Agent({keepAlive: true, maxSockets: 25, maxFreeSockets: 2, ca: fs.readFileSync('./my-ca.crt') });
const options = {
  agent: pool,
  agentOptions: { ca: fs.readFileSync('./my-ca.crt') }
}

if( config.iracingServiceToken())
  options.authorization = config.iracingServiceToken()

const _baseRequest = request.defaults(options)

function requestPromise(opts) {
  return when.promise((res, rej) => {
    $logger.info('> ' + opts.method + ' ' + opts.uri)
    _baseRequest(opts, (err, response, body) => {
      if(err) {
        $logger.error('! ' + opts.method + ' ' + opts.uri)
        return rej(err)
      }

      $logger.info('< ' + opts.method + ' ' + opts.uri + ' ' + response.statusCode)
      res(response)
    })
  })
}

const baseRequest = guard(guard.n(30), requestPromise)

function retryTimes(f, count = 3) {
  return f()
    .catch( err => when(null).delay(1000).then( () => {
      if (count < 0)
        throw new Error(err.stack);
      else
        return retryTimes(f, count - 1)
    }))
}

function get(url) {

  var options = {
    uri: url.match(/^http/) ? url : host + url,
    json: true,
    method: 'GET'
  }

  return retryTimes(() => baseRequest(options), 3)
}

export default { get: get }
