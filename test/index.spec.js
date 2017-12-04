const expect = require('chai').expect;
const createTimeSeries = require('../src/index');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

describe('Time Series module', () => {
  const url = 'mongodb://localhost:27017/timeseries-test';
  let db;
  let timeSeries;

  before(async () => {
    db = await MongoClient.connect(url);
    timeSeries = createTimeSeries(db);
  });

  beforeEach(async () => {
    await db.collection('DataPoint').deleteMany({});
  });

  it('allows to add a data point', async () => {
    const data = { value: 42 };
    const instant = new Date().getTime();
    const code = await timeSeries.addDataPoint(data, instant);
    const docs = await db
      .collection('DataPoint')
      .find({ _id: new ObjectID(code) })
      .toArray();
    expect(docs.length).to.equal(1);
    expect(docs[0]).to.deep.include({ data: data, instant: instant });
  });

  it('allows to fetch a data point', async () => {
    const data = { value: 42 };
    const instant = new Date().getTime();
    const data2 = { value: 11 };
    const instant2 = new Date().getTime();

    const { insertedIds } = await db
      .collection('DataPoint')
      .insertMany([{ data, instant }, { data: data2, instant: instant2 }]);
    const dataPoint = await timeSeries.fetchDataPoint(insertedIds[0]);
    expect(dataPoint).to.deep.equal({ code: insertedIds[0], data, instant });
  });

  after(() => {
    db.close();
  });
});
