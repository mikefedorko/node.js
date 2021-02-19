// Transform
const { Transform } = require('stream')

const Ui = require('./ui.js')
const Manager = require('./manager.js')
const Logger = require('../logger.js')

class Guardian extends Transform {
    constructor(options = {}) {
        super(options)
        
        this.transformCustomers
    }

    _transform(chunk, encoding, done) {
        console.log('\n -------- Guardian\n ')

        this.transformCustomers = {
            meta: {
                source: 'ui'
            },
            payload: {
                ...chunk,
                email: Buffer.from(chunk.email, 'utf8').toString('hex'),
                password: Buffer.from(chunk.password, 'utf8').toString('hex')
            }
        }
    
        this.push(this.transformCustomers)

        done()
    }
}

const customers = [
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
]

const ui_options = {
    objectMode: true
};

const ui = new Ui(customers, ui_options)

const g_options = {
    readableObjectMode: true,
    decodeStrings: false,
    objectMode: true
}

const l_options = {
    readableObjectMode: true,
    decodeStrings: false,
    objectMode: true
}

const logger = new Logger(l_options )

const guardian = new Guardian(g_options)

const m_options = {
    objectMode: true
}

const manager = new Manager(m_options)

ui.pipe(guardian).pipe(logger).pipe(manager)