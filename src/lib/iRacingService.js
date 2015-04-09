import request from 'request';
import when from 'when';
import fs from 'fs';
import config from 'lib/config';
import guard from 'when/guard';

const host = config.hostPrefix()

const _baseRequest = request.defaults({
  pool: {maxSockets: 3 },
  agentOptions: { ca: fs.readFileSync('./my-ca.crt') },
  headers: { authorization: config.iracingServiceToken() }
})

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

const baseRequest = guard(guard.n(3), requestPromise)

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
    uri: host + url,
    json: true,
    method: 'GET'
  }

  return retryTimes(() => baseRequest(options), 3)
}

export default { get: get }
