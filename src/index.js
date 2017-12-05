'use strict'
const ObjectID = require('mongodb').ObjectID
const { Writable, Transform } = require('stream')

module.exports = db => {
  async function addDataPoint (data, instant) {
    const result = await db.collection('DataPoint').insertOne({ data, instant })
    return result.insertedId.toHexString()
  }

  async function fetchDataPoint (code) {
    const result = await db.collection('DataPoint').findOne({ _id: new ObjectID(code) })

    if (result) {
      return { code: result._id, data: result.data, instant: result.instant }
    } else {
      throw new Error('Not found')
    }
  }

  function createWriteStream () {
    const writable = new Writable({
      objectMode: true,
      write (chunk, enc, cb) {
        db.collection('DataPoint').insertOne(chunk, cb)
      }
    })

    return writable
  }

  function createReadStream () {
    const transform = new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        this.push({ code: chunk._id, data: chunk.data, instant: chunk.instant })
        callback()
      }
    })

    const readable = db.collection('DataPoint').find()

    return readable.pipe(transform)
  }

  return { addDataPoint, fetchDataPoint, createReadStream, createWriteStream }
}
