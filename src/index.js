const MongoClient = require('mongodb').MongoClient;

function TimeSeries(url) {
  this.url = url;
}

TimeSeries.prototype.addDataPoint = function(data, instant) {
  console.log(this.url);
  return new Promise((resolve, reject) => {
    MongoClient.connect(this.url, (err, db) => {
      db.collection('DataPoint').insertOne({ data, instant }, (err, result) => {
        resolve(result._id);
      });
    });
  });
};

module.exports = url => new TimeSeries(url);
