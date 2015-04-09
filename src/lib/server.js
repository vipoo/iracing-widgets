import express from 'express';
import morgan from 'morgan';
import config from 'lib/config';
import fs from 'fs';


/*eslint-disable no-console*/
const accessLogger = { write: data => console.log(data.slice(0, data.length-1)) }
/*eslint-enable no-console*/
const html404 = fs.readFileSync('./public/404.html').toString()

const app = express()

app.use(morgan(':date[iso] :remote-addr :remote-user :method :url :status - :req[content-length] - :res[content-length] - :response-time ms', {stream: accessLogger}))
app.use('/', express.static('public'))
app.get('/widgets.js', require('widgetsHandler'))

app.use((req, res) => {
  res.status(404)
  res.send(html404)
});

switch( config.nodeEnv() ) {
  case 'test':
   app.listen(4181);
    break;

  case 'production':
    app.listen(81)
    break;

  default:
    app.listen(4081)
}

export default app
