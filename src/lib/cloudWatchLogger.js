import util from 'util';
import winston from 'winston';
import CloudWatchLogs from 'lib/paws/cloudWatchLogger';

const BufferMarkPeriod = 100;
const BufferMarkAmount = 20;
const DefaultWaitPeriod = 2000;

class CloudWatchLogger extends winston.Transport {
  constructor(options) {
    super()
    this.name = 'cloudWatchLogger';
    this.level = options.level || 'info';
    this.logStreamName = options.logStreamName
    this.logGroupName = options.logGroupName
    this.logEvents = []
    this.awsCloudWatchlogs = new CloudWatchLogs(options)
  }

  log(level, msg, meta, callback) {
    let metaString = JSON.stringify(meta, null, '  ')
    let parts = [level, msg]
    if( metaString !== '{}') parts.push(metaString)

    this.logEvents.push({
      message: parts.join(' - '),
      timestamp: new Date().getTime()
    });

    if (this.uploading)
      return

    if (this.logEvents.length > BufferMarkAmount && this.uploadTimer) {
      if (this.timeout !== BufferMarkPeriod)
        this.resetTimer(BufferMarkPeriod)
      return;
    }

    this.resetTimer(this.logEvents.length > BufferMarkAmount ? BufferMarkPeriod : DefaultWaitPeriod)
  }

  resetTimer(timeout) {
    this.timeout = timeout
    if (this.uploadTimer) clearTimeout(this.uploadTimer)
    this.uploadTimer = setTimeout( () => this.upload(), timeout )
  }

  upload() {
    this.uploadTimer = null
    this.uploading = true

    this.awsCloudWatchlogs.describeLogStreams({ logGroupName: this.logGroupName })
      .then(data => data.logStreams.find(logStream => logStream.logStreamName === this.logStreamName))
      .then(data => data.uploadSequenceToken)
      .then(sequenceToken => this.awsCloudWatchlogs.putLogEvents({
          sequenceToken: sequenceToken,
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents: this.logEvents.splice(0, BufferMarkAmount)
        }))
      .catch(err => {
        console.log('Error processing cloud watch logs!')
        return err.stack ? console.log(err.stack) : console.log(err)
      })
      .done(() => {
        this.uploading = false
        if (this.logEvents.length > 0 )
          this.resetTimer(BufferMarkPeriod)
      })
  }
}

export default CloudWatchLogger;
