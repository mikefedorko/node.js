// Writable
const { Writable } = require('stream')
const util = require('util')

class Manager extends Writable {
    constructor(options = {}) {
        super(options)

        const {objectMode, highWaterMark, buffer, length, flowing, encoding} = this._writableState

        console.log('\n -------- Data in Writable constructor\n ')
        console.log(`Writable options 
            ${util.inspect({objectMode, highWaterMark, buffer, length, flowing, encoding}, false, null, true)}\n`
        )
    }

    _write({ payload }, encoding, done) {
        console.log('Payload:', payload);
        done();
    }
}

module.exports = Manager;