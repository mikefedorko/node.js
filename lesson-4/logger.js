const { Transform } = require('stream')

const Db = require('./db')

class Logger extends Transform {
    constructor(options = {}) {
        super(options)
        this.db = new Db()
    }

    _transform(chunk, encoding, done) {
        console.log('\n -------- Logger\n ')

        this.db.emit('db_save', chunk)
        this.push(chunk)
        done()
    }
}

module.exports = Logger