const fs = require('fs')
const path = require('path') 
const zlib = require('zlib')
const { pipeline } = require('stream')

class Archiver {
    constructor(arch, unArch, options) {
        this.arch = arch
        this.unArch = unArch
        this.options = options
        this.init()
    }

    init() {
        if (!this.options.hasOwnProperty('algorithm')) {
            return this.emit('error', 'Required fields are empty')
        } 

        if(typeof this.options.algorithm !== 'string') {
            return this.emit('error', 'No string type value')
        }

        if(this.options.algorithm !== 'gzip' && this.options.algorithm !== 'deflate') {
            return this.emit('error', 'Bad algorithm type')
        }
    }

    archive(){
        const r = fs.createReadStream(path.join(__dirname, '/format_data/comments.csv'))
        const w = fs.createWriteStream(path.join(__dirname, '/format_data/comments.csv.gz'))

        pipeline(
            r,
            this.arch,
            w,
            (err) => {
                if (err) {
                  console.error('Pipeline failed.', err);
                } else {
                  console.log('Pipeline succeeded.');
                }
              }
        )
    }

    unArchive(){
        const r = fs.createReadStream(path.join(__dirname, '/format_data/comments.csv.gz'))
        const w = fs.createWriteStream(path.join(__dirname, '/format_data/comments_unArch.csv'))

        pipeline(
            r,
            this.unArch,
            w,
            (err) => {
                if (err) {
                  console.error('Pipeline failed.', err);
                } else {
                  console.log('Pipeline succeeded.');
                }
              }
        )
    }
}   

const options = {
    algorithm: 'gzip'
}

const arch = options?.algorithm !== 'deflate' ? zlib.createGzip() : zlib.deflate()
const unArch = options?.algorithm !== 'deflate' ? zlib.createGunzip() : zlib.inflate()

const archiver = new Archiver(arch, unArch, options)

// archiver.archive()
// archiver.unArchive()