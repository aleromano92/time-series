# time-series
A TimeSeries module to track time data about assets.

It requires an url of a MongoDB connection.

The module exposes 2 functions:
* one for adding new datapoints
* one for fetching data from the datapoints

# How to use
```javascript
const createTimeSeries = require('@axel92/time-series');
const timeSeries = createTimeSeries('mongodb://localhost:27017/timeseries-test');
const data = { value: 42 };
const instant = new Date().getTime();

timeSeries.addDataPoint(data, instant).then((id) => {
  console.log('Doc created with id: ', id);
});

const { data, time } = fetchDataPoint(id);
console.log('Data: ', data, ' at ', time);
```
