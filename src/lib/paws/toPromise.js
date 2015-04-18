var when = require('when');

module.exports = function(obj, fn) {
  return function() {
    var args = Array.slice(arguments);
    return when.promise((res, rej) => {
      args.push((err, data) => err ? rej(err) : res(data))
      obj[fn](...args)
    })
  }
}
