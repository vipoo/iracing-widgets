var AWS = require('aws-sdk');
var toPromise = require('./toPromise');

module.exports = class {
  constructor() {
    var aws = new AWS.CloudWatchLogs(...Array.slice(arguments))
    this.describeLogStreams = toPromise(aws, 'describeLogStreams')
    this.putLogEvents = toPromise(aws, 'putLogEvents')
  }
}
