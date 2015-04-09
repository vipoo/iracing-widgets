process.env.NODE_ENV = 'test'
import 'init'
GLOBAL.request = require('supertest-as-promised');

