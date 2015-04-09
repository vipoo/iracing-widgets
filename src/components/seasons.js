import React from 'react';
import Season from 'components/season';
import iRacingService from 'lib/iRacingService';
import WidgetNames from 'lib/widgetNames';

WidgetNames.add('seasons')

const Seasons = React.createClass({

  getInitialState() {
    return { };
  },

  render() {
    var seasons = this.props.seasons._embedded.seasons.map(renderRow)
    return (
      <div className='iracing-widget'>
        <table className='table table-bordered iracing-seasons'>
          {renderHeadingRow()}
          {seasons}
        </table>
      </div>
    );
  }

});

Seasons.inject = function() {
  return iRacingService.get('/seasons?active=true')
    .then( data => <Seasons seasons={data.body} />)
}

function renderRow(season) {
  return (<tr><td>{season.series_name}</td></tr>)
}

function renderHeadingRow() {
  return (<tr><th>Season Name</th></tr>)
}

export default Seasons
