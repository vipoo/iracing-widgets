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
    var driversRow = this.props.drivers.map(renderRow)
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
  return (<tr><td>{driver.name}</td></tr>)
}

function renderHeadingRow() {
  return (<tr><th>Name</th></tr>)
}

export default LeagueDrivers
