const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function TimeSeries(url) {
  this.url = url;
}

TimeSeries.prototype.addDataPoint = function(data, instant) {
  console.log(this.url);
  return new Promise((resolve, reject) => {
    MongoClient.connect(this.url, (err, db) => {
      db.collection('DataPoint').insertOne({ data, instant }, (err, result) => {
        resolve(result.insertedId.toHexString());
      });
    });
  });
};

TimeSeries.prototype.fetchDataPoint = function(code) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(this.url, (err, db) => {
      db
        .collection('DataPoint')
        .findOne({ _id: new ObjectID(code) })
        .then(mongoResult => {
          console.log(mongoResult);
          const result = mongoResult;
          resolve({ code: mongoResult._id, data: mongoResult.data, instant: mongoResult.instant });
        })
        .catch(console.log);
    });
  });
};

module.exports = url => new TimeSeries(url);
