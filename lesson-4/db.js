const EventEmitter = require('events')

class Db extends EventEmitter {
    constructor() {
        super()

        this.storage
        this.on('db_save', ({ meta: { source }, payload }) => {
            this.storage = {
                source,
                payload,
                created: new Date().toJSON().slice(0,19).replace(/T/g,'/')
            }
            console.log('Data storage in DB:\n', this.storage)
        })
    }
}

module.exports = Db