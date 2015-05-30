import express from 'express';
import morgan from 'morgan';
import config from 'lib/config';
import compression from 'compression';
import fs from 'fs';

const html404 = fs.readFileSync('./public/404.html').toString()

const accessLogger = {
  write: data => !data.match(/\/health/) ? $logger.access(data.slice(0, data.length-1)) : null
}

const app = express()
app.use(morgan(':date[iso] :remote-addr :remote-user :method :url :status - :req[content-length] - :res[content-length] - :response-time ms', {stream: accessLogger}))
app.set('view engine', 'ejs');
app.set('views', 'src/site/views');

app.use(compression())
var oneDay = 86400000;
app.use('/', express.static('public', { maxAge: oneDay }))

app.get('/widgets', (req, res) => res.render('widgets'))
app.get('/data', (req, res) => res.render('data'))
app.get('/data-routes', (req, res) => res.render('data-routes'))
app.get('/index', (req, res) => res.render('index'))
app.get('/', (req, res) => res.render('index'))

app.get('/widgets/:widgetName', require('widgets/widgetHandler'))

app.use((req, res) => {
  res.status(404)
  res.send(html404)
});

switch( config.nodeEnv() ) {
  case 'test':
    app.listen(4181);
    break;

  default:
    $logger.info('Widgets hosted on port 4081')
    app.listen(4081)
}

export default app
