process.env.NODE_PATH = __dirname + '/src';
require('module').Module._initPaths();

module.exports = require('./_gruntFile.js')
