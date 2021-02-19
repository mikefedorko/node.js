const fs = require('fs')
const path = require('path') 

class Json2csv {
    constructor(fields) {
        this.fields = fields
        this.format2csv()
    }


    format2csv() {
        fs.readFile(path.join(__dirname, '/data/comments.json'), (error, data) => {
            if(error) {
                console.log(error)
            }

            const items = JSON.parse(data)
            const replacer = (key, value) => value === null ? '' : value // проверка на null
            const header = Object.keys(items[0])
            const isFiltered = header.some(r => this.fields.indexOf(r) >= 0)

            if(isFiltered) {
                const csv = [
                    this.fields.join(','), // header row first
                    ...items.map(row => this.fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
                ].join('\r\n')
            
                fs.writeFile(path.join(__dirname, '/data_csv/comments.csv'), csv, err => {
                    if (err) return console.log(err)
                    console.log('FILE SUCCESSFULLY WRITTEN!\n')
                })
            } 
        })
    }
}

const fields = ['postId','name','body']

const json2csv = new Json2csv(fields)