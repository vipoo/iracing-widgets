import React from 'react';
import when from 'when';
import fs from 'fs';
import widgetNames from 'lib/widgetNames'

var normalizedPath = require('path').join(__dirname, 'components');
fs.readdirSync(normalizedPath).forEach(f => require('components/' + f))

function addWidget(widgetName, res, widget) {

  return widget
          .inject()
          .then(component => React.renderToStaticMarkup(component))
          .then(html => res.write(`iRacingWidgets.${widgetName} = '${html}';`))
}

export default function(req, res) {

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');

  res.write('var iRacingWidgets = { inject: function(k) { if(iRacingWidgets[k]) document.write(iRacingWidgets[k]) } };')

  when
    .all(Object
            .keys(req.query)
            .filter(k => widgetNames.has(req.query[k]))
            .map(k => addWidget(k, res, require('components/' + req.query[k]))))
    .catch(err => {
      res.write('console.log("Error producing widget javascript!"); throw new Error("Error producing widget javascript!")')
      throw err
    })
    .finally(() => res.end())

}
