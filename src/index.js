const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports = db => {

  function addDataPoint(data, instant) {
    return new Promise((resolve, reject) => {
      db.collection('DataPoint').insertOne({ data, instant }, (err, result) => {
        resolve(result.insertedId.toHexString());
      });
    });
  }

  function fetchDataPoint(code) {
    return new Promise((resolve, reject) => {
      db
        .collection('DataPoint')
        .findOne({ _id: new ObjectID(code) })
        .then(mongoResult => {
          const result = mongoResult;
          resolve({ code: mongoResult._id, data: mongoResult.data, instant: mongoResult.instant });
        })
        .catch(console.log);
    });
  }

  return { addDataPoint, fetchDataPoint }
};
