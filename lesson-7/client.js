const net = require('net')
const path = require('path')
const fs = require('fs')
const EventEmitter = require('events')

const myEmitter = new EventEmitter()
const client = new net.Socket()

const CSV_PATH = path.join(__dirname, 'users.csv')
const JSON_ARCH_PATH = path.join(__dirname, 'users.json.gz')

const filter = {
    name: {
        first: 'John',
        last: 'ds' 
    },
    phone: '56', 
    address: {
        zip: '1234', 
        city: 'Willmouth', 
        country: 'Italy', 
        street: 'so'
    },
    email: '@gmail.com',
    meta: {
        format: 'csv',
        // or
        // archive: true
    }
}

const checker = (obj) => {
    const topKeys = [ 'name', 'phone', 'address', 'email', 'meta' ]

    for (let i = 0; i < topKeys.length; i++) {
        if (!obj.hasOwnProperty(topKeys[i])) {
            return myEmitter.emit('error', 'Required fields are empty')
        } 

        switch (typeof obj[topKeys[i]]) {
            case 'string':
                break;
            case 'object':
                if(!Object.keys(obj[topKeys[i]])?.length){
                    myEmitter.emit('error', 'Address or name has empty object')
                }
                break;
            default:
                myEmitter.emit('error', 'No string or object type value')
        }

        if(Object.keys(obj).length > topKeys.length) {
            return myEmitter.emit('error', 'Filter has extra field')
        }     
    }
}

client.connect(8080, () => {
    checker(filter)
    console.log('Connected!')
    client.write(JSON.stringify(filter))
})

client.on('data', data => {
    fs.access(CSV_PATH, fs.F_OK, (err) => {
        try {
            console.log(data.toString())    
        } catch (err) {
            console.error(err)
        }
    })

    fs.access(JSON_ARCH_PATH, fs.F_OK, (err) => {
        try {
            console.log(JSON.parse(data))
        } catch (err) {
            console.error(err)
        }
    })
})

client.on('close', () => {
    console.log('Connection closed!')
})