const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/timeseries-test';

function addDataPoint(data, time) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      db.collection('DataPoint').insertOne({data: data, instant: time}, (err, result) => {
        resolve(result._id);
      });
    });
  });
}

module.exports = { addDataPoint };