const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function TimeSeries(db) {
  this.db = db;
}

TimeSeries.prototype.addDataPoint = function(data, instant) {
  return new Promise((resolve, reject) => {
    this.db.collection('DataPoint').insertOne({ data, instant }, (err, result) => {
      resolve(result.insertedId.toHexString());
    });
  });
};

TimeSeries.prototype.fetchDataPoint = function(code) {
  return new Promise((resolve, reject) => {
    this.db
      .collection('DataPoint')
      .findOne({ _id: new ObjectID(code) })
      .then(mongoResult => {
        const result = mongoResult;
        resolve({ code: mongoResult._id, data: mongoResult.data, instant: mongoResult.instant });
      })
      .catch(console.log);
  });
};

module.exports = db => new TimeSeries(db);
