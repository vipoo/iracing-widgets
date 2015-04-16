import React from 'react';
import when from 'when';
import fs from 'fs';
import widgetNames from 'lib/widgetNames'

var normalizedPath = require('path').join(__dirname, 'components');
fs.readdirSync(normalizedPath).forEach(f => require('components/' + f))

function addWidget(widgetName, res, widget, args) {

  return widget
          .inject(...args)
          .then(component => React.renderToStaticMarkup(component))
          .then(html => res.write(`iRacingWidgets.${widgetName} = '${html}';`))
}

const widgetBootstrap = fs.readFileSync('./src/assets/widgetInjector.js').toString();

function extractWidgetParams(instanceName, input) {
  //input = widgetType[arg1, arg2, ...]
  let match = input.match(/^(.*)\[(.*)\]/)
  if( !match )
    return null;

  let name = match[1]
  let args = match[2].split(',')

  return { instanceName, name, args }
}

export default function(req, res) {

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');

  let filename = req.headers.host + '/main.css'

  res.write(widgetBootstrap.replace('$$filename$$', filename))

  when
    .all(Object
            .keys(req.query)
            .map(k => extractWidgetParams(k, req.query[k]))
            .filter(k => !!k)
            .filter(k => widgetNames.has(k.name))
            .map(k => addWidget(k.instanceName, res, require('components/' + k.name), k.args)))
    .catch(err => {
      res.write('console.log("Error producing widget javascript!"); throw new Error("Error producing widget javascript!")')
      throw err
    })
    .finally(() => res.end())

}
