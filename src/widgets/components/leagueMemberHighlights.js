import React from 'react';
import iRacingService from 'lib/iRacingService';
import WidgetNames from 'lib/widgetNames';
import when from 'when';

WidgetNames.add('leagueMemberHighlights')

const outerStyles = {
  background: '#FFFFFF',
  height: '200px',
  width: '360px',
  paddingTop: '25px'
}

const innerStyles = {
  width: '300px',
  marginLeft: '30px'
}

const Component = React.createClass({

  getInitialState() {
    return { };
  },

  render() {
    var driversRow = this.props.drivers.map(renderRow)

    return (
      <div style={outerStyles}>
        <div style={innerStyles}>
          <div className='iracing-widget'>
            <div className='leagueMemberHighlights'>
              {driversRow}
            </div>
          </div>
        </div>
      </div>
    );
  }

});

function renderRow(driver) {
  console.log(driver)
  return <div>
    <p>{driver.driver.name}</p>
    <p>Session Time: {driver.stats ? driver.stats.session_time : ''}</p>
    <p>Session Type: {driver.stats ? driver.stats._links.session_type.title : ''}</p>
  </div>
}

function applyDriverStats(drivers) {
  let driverStat = d => {
    if( d._links.stats && d._links.stats.href )
      return iRacingService
      .get(d._links.stats.href)
      .then(r => { return { driver: d, stats: r.body._embedded.stats[0] } })

    return when({driver: d})
  }
  return when
    .map(drivers, driverStat)
}

Component.inject = function(params) {
  return iRacingService.get('/leagues/' + parseInt(params.leagueId))
    .then( res => iRacingService.get(res.body._links.drivers.href) )
    .then( res => when.map(res.body._embedded.drivers, d => iRacingService.get(d._links.driver.href).then(r => r.body)))
    .then( drivers => applyDriverStats(drivers))
    .then( drivers => <Component drivers={drivers} /> )
}

export default Component
