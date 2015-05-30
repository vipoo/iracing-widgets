import request from 'request';
import when from 'when';
import fs from 'fs';
import config from 'lib/config';
import guard from 'when/guard';
import https from 'https';
import moment from 'moment';
import poll from 'when/poll';

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

const inMemoryCache = new Map()

setInterval(() => {
  try {
    for(let item of inMemoryCache) {
      let expireStamp = item[1].response.headers['expires']
      if( !expireStamp )
        inMemoryCache.delete(item[0])
      else {
        let expiresAt = moment(new Date(expireStamp))
        let age = moment.duration(expiresAt.diff(moment())).asSeconds()
        if( age <= 0 )
          inMemoryCache.delete(item[0])
      }
    }
  } catch(err) {
    $logger.error(err.stack)
  }
}, 5000)

let sweeping = false

setInterval(() => {
  try {
    if(!sweeping && inMemoryCache.size <= 1000)
      return

    sweeping = true
    let orderedItems = Array.from(inMemoryCache).sort((a, b) => a[1].accessedAt - b[1].accessedAt)
    let count = inMemoryCache.size - 1001
    let index = 0
    poll(() => inMemoryCache.delete(orderedItems[index++][0]), 1, () => count-- <= 0)
      .then(() => sweeping = false)
      .catch(() => sweeping = false)

  } catch(err) {
    $logger.error(err.stack)
    sweeping = false
  }
}, 1000)

function get(url) {

  const path = url.match(/^http/) ? url : host + url
  const cachedHit = inMemoryCache.get(path)
  if(cachedHit)
    return when(cachedHit.response)

  const options = {
    uri: path,
    json: true,
    method: 'GET'
  }

  return retryTimes(() => baseRequest(options), 3)
    .tap(response => inMemoryCache.set(path, { response, accessedAt: moment() }))

}

export default { get: get }
