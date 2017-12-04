const expect = require('chai').expect;
const createTimeSeries = require('../src/index');
const MongoClient = require('mongodb').MongoClient;

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
    const instant = new Date().getTime()
    timeSeries.addDataPoint(data, instant).then(id => {
      db
        .collection('DataPoint')
        .find({ id })
        .toArray((err, docs) => {
          expect(docs.length).to.equal(1);
          expect(docs[0]).to.deep.include({data: data, instant: instant});
          done();
        });
    });
  });

  after(() => {
    db.close();
  });
});
