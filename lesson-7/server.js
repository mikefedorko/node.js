const net = require('net')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const server = net.createServer()
const PORT = process.env.PORT || 8080
const arch = zlib.createGzip()

server.on('connection', socket => {
    console.log('New client connected!')

    socket.on('data', msg => {
        const clientObj = JSON.parse(msg)
        fs.readFile(path.join(__dirname, '/users.json'), (error, data) => {
            if(error) {
                console.log(error)
            }

            // Optional, in this case searching by lastname
            const items = JSON.parse(data).filter(item => {
                if(item.name.last.includes(clientObj.name.last)) {
                    return item
                }
            })

            if(clientObj?.meta) {
                return csvFormatter(items, clientObj, socket)
            }
        })
    })

    socket.on('end', () => {
        console.log('Client is disconnected!')
    })
})

server.listen(PORT, () => {
    console.log(`TCP Server started on port ${PORT}!`)
})

const csvFormatter = (items, filter, socket) => {
    const replacer = (key, value) => value === null ? '' : value // check on null
    const fields = ['id','name','phone', 'address', 'email']
    const csv = [
        fields.join(','),
        ...items.map(row => fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
    const { meta } = filter
    
    switch (true) {
        case (meta?.format === 'csv' && !meta.hasOwnProperty('archive')):
            fs.writeFile(path.join(__dirname, 'users.csv'), csv, err => {
                if (err) return console.log(err)
                socket.write(csv)
            })
            break;
        case (!meta.hasOwnProperty('format') && meta?.archive):
            const inp = fs.createReadStream(path.join(__dirname, 'users.json'));
            const out = fs.createWriteStream(path.join(__dirname, 'users.json.gz'));
            socket.write(JSON.stringify(items))
            break;
        default:
            return
            break;
    }
}