const expect = require('chai').expect;
const createTimeSeries = require('../src/index');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

describe('Time Series module', () => {
  const url = 'mongodb://localhost:27017/timeseries-test';
  let db;
  let timeSeries;

  before(done => {
    MongoClient.connect(url, function(err, mongoInstance) {
      db = mongoInstance;
      timeSeries = createTimeSeries(url);
      done();
    });
  });

  beforeEach(done => {
    db.collection('DataPoint').deleteMany({}, done);
  });

  it('allows to add a data point', done => {
    const data = { value: 42 };
    const instant = new Date().getTime();
    timeSeries.addDataPoint(data, instant).then(code => {
      db
        .collection('DataPoint')
        .find({ _id: new ObjectID(code) })
        .toArray((err, docs) => {
          expect(docs.length).to.equal(1);
          expect(docs[0]).to.deep.include({ data: data, instant: instant });
          done();
        });
    });
  });

  it('allows to fetch a data point', done => {
    const data = { value: 42 };
    const instant = new Date().getTime();
    const data2 = { value: 11 };
    const instant2 = new Date().getTime();

    db
      .collection('DataPoint')
      .insertMany([{ data, instant }, { data: data2, instant: instant2 }])
      .then(({ insertedIds }) => {
        timeSeries.fetchDataPoint(insertedIds[0]).then(dataPoint => {
          expect(dataPoint).to.deep.equal({ code: insertedIds[0], data, instant });
          done();
        });
      })
      .catch(console.log);
  });

  after(() => {
    db.close();
  });
});
