import React from 'react';
import moment from 'moment';
import widgetNames from 'lib/widgetNames';
import fs from 'fs';
import path from 'path';

const normalizedPath = path.join(__dirname, 'components');
fs.readdirSync(normalizedPath).forEach(f => require('./components/' + f))

export default function(req, res) {
  const expireAt = moment().add(2, 'hour')
  const maxAge = 60 * 60 * 2

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('expires', moment(expireAt).format('ddd, DD MMM YYYY, HH:mm:ss') + ' GMT')
  res.setHeader('cache-control', 'max-age=' + maxAge)

  const widgetName = req.params.widgetName

  if (!widgetNames.has(widgetName)) {
    res.status(404)
    res.send("throw new Error('No such widget: " + widgetName.replace(/'/g, '') + "');")
    return
  }

  const widget = require('widgets/components/' + widgetName)

  widget
    .inject(req.query.leagueId)
    .then(component => React.renderToStaticMarkup(component))
    .then(html => res.send(`document.write('${html}');`))
    .done()
}
