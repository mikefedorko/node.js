// Readable
const util = require('util')
const { Readable } = require('stream')

class Ui extends Readable {
    constructor(data = [], options = {}) {
        super(options)

        this.data = data
        this.props = ['name', 'email', 'password']

        const {objectMode, highWaterMark, buffer, length, flowing, encoding} = this._readableState

        console.log('\n -------- Data in Readable constructor\n ')
        console.log(`Readable options 
            ${util.inspect({objectMode, highWaterMark, buffer, length, flowing, encoding}, false, null, true)}\n`
        )

        this.init()
    }

    init() {
        this.hasAllProperties()
        this.on('data', chunk => {
            /*
                {
                    name: 'Pitter Black', 
                    email: 'pblack@email.com', 
                    password: 'pblack_123'
                },
                {
                    name: 'Oliver White', 
                    email: 'owhite@email.com',
                    password: 'owhite_456'
                }
            */ 
        })
    }
    
    hasAllProperties() {
        this.data.map(el => {
            for (let i = 0; i < this.props.length; i++) {
                if (!el.hasOwnProperty(this.props[i])) {
                    return this.emit('error', 'Required fields are empty')
                } 

                if(typeof Object.values(el)[i] !== 'string') {
                    return this.emit('error', 'No string type value')
                }
            }

            if(Object.keys(el).length !== this.props.length) {
                return this.emit('error', 'Customer had extra field')
            }
        })
    }

    _read() {
        const data = this.data.shift();

        if (!data) {
            this.push(null);
        } else {
            this.push(data);
        }
    }
}

module.exports = Ui