# time-series
A TimeSeries module to track time data about assets.

The module exposes 2 functions:
* one for adding new datapoints
* one for fetching data from the datapoints

# How to use
```javascript
const { addDataPoint, fetchDataPoint } = require('@axel92/time-series');

const id = addDataPoint(data, time);

const { data, time } = fetchDataPoint(id);
console.log('Data: ', data, ' at ', time);
```
