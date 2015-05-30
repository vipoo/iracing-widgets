import React from 'react';

export default React.createClass({

  getInitialState() {
    return { };
  },

  render() {
    return (
      <div>Season Name: {this.props.season.series_name}</div>
    );
  }

});
