import AWS from 'aws-sdk';
import toPromise from './toPromise';

export default class {
  constructor() {
    var aws = new AWS.CloudWatchLogs(...Array.slice(arguments))
    this.describeLogStreams = toPromise(aws, 'describeLogStreams')
    this.putLogEvents = toPromise(aws, 'putLogEvents')
  }
}
