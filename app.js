process.env.NODE_PATH = __dirname + '/src';
require('module').Module._initPaths();

require('lib/babel');
require('init');
