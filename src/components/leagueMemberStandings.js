import React from 'react';
import iRacingService from 'lib/iRacingService';
import WidgetNames from 'lib/widgetNames';
import when from 'when';

WidgetNames.add('leagueMemberStandings')

const LeagueDrivers = React.createClass({

  getInitialState() {
    return { };
  },

  render() {
    var driversRow = this.props.drivers.sort(byMaxIRating).map(renderRow)
    return (
      <div className='iracing-widget'>
        <table className='table table-bordered iracing-seasons'>
          {renderHeadingRow()}
          {driversRow}
        </table>
      </div>
    );
  }

});

LeagueDrivers.inject = function() {
  return iRacingService.get('/leagues/138')
    .then( res => iRacingService.get(res.body._links.drivers.href) )
    .then( res => when.map(res.body._embedded.drivers, d => iRacingService.get(d._links.driver.href).then(r => r.body)))
    .then( drivers => <LeagueDrivers drivers={drivers} /> )

}

function renderRow(driver) {
  let ovalRating = getIRating(driver, 'oval')
  let roadRating = getIRating(driver, 'road')

  let boldOval = ovalRating > roadRating
  let boldRoad = ovalRating < roadRating

  let renderOval = boldOval ? <b>{ovalRating}</b> : ovalRating
  let renderRoad = boldRoad ? <b>{roadRating}</b> : roadRating
  return (<tr><td>{driver.name}</td><td>{renderOval}</td><td>{renderRoad}</td></tr>)
}

function getIRating(driver, raceType) {
  return driver._embedded && driver._embedded[raceType] ? driver._embedded[raceType].irating : ''
}

function getMaxIRating(driver) {
  return Math.max(getIRating(driver, 'oval'), getIRating(driver, 'road'))
}

function byMaxIRating(a, b) {
  return getMaxIRating(b) - getMaxIRating(a)
}

function renderHeadingRow() {
  return (<tr><th>Name</th><th>Oval iRating</th><th>Road iRating</th></tr>)
}

export default LeagueDrivers
