'use strict';
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports = db => {
  async function addDataPoint(data, instant) {
    const result = await db.collection('DataPoint').insertOne({ data, instant });
    return result.insertedId.toHexString();
  }

  async function fetchDataPoint(code) {
    const result = await db.collection('DataPoint').findOne({ _id: new ObjectID(code) });

    if (result) {
      return { code: result._id, data: result.data, instant: result.instant };
    } else {
      throw new Error('Not found');
    }
  }

  return { addDataPoint, fetchDataPoint };
};
