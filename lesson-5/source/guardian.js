// Transform
const { Transform } = require('stream')
const crypto = require('crypto')

const Ui = require('./ui.js')
const Manager = require('./manager.js')

const server_key = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC1mL2M1GYT2rUGNNQHVJdF7TyKLYPqgvv9VfOdgPDgm8E8edzJ
kip1ajfymrODg0m7U95sUOw1s1r/WZzLdIPHgDxbLHrDbQEWVgdTM2okje7pPOax
7PguhGHd2y2WEXGBUNXG0jQCyfq83nDl3YwJuPKNpgEPzzxibg8j3suKaQIDAQAB
AoGAA9LniuOeEqT0UuEh5dWeKdbJA4/Zy0Je1ALPUm24pMIi24clYwk046wM6Yrg
ZNCK6OrnMBi0IJ1aOS5F4vLdI3k2tcKmtdHlVHQl3YZZLUBubJF8HPZHyhYlargY
gWYMC8Wi2Z63fllb+A5yVgJZigEowkYzQSg1LS09vkMJL5ECQQDcM3DzC3qvp3AV
6p5uGKFI1nug4Y8XQvQZHRRoZL0UuRnCJZR/4OpI2rjWNXwsYibf7V0PZ3FXPajZ
gkVtnpbLAkEA0x6fxNlOkD6AIgAy4EW26eLRDuh8LSDBG/a2nfdRduMa0PwFglmT
heOmFqD8fJA4bCvhYl/cKCo/cGQmRj2JGwJBAJNmo+8t+fxnWvJw0YjlV+GIIc25
760kln3RJ34SITgkCAgcW+GWT35hW2WY+/xB37/6BldvaUF69vJS7+LHTC0CQCEP
n6d8/E+cagZpD46NfEp+KYzzHVcX1QXjCdANBeXfRLjLbrVt/6ss7jqG9WMwVpWh
/YahSmHD0/FuzYucYVcCQQDOL5EooCObADlMZwW6gkfRUhg8qNpLIKjZqdR2TOef
3MliwMWCHG2zzgsz8h+H/sQ9tWT+RCq8xA0RCJTcc/yk
-----END RSA PRIVATE KEY-----`;

class Guardian extends Transform {
    constructor(options = {}) {
        super(options)

        this.cypherCustomers
    }

    _transform(chunk, encoding, done) {
        // console.log('\n -------- Guardian\n ')

        const algorithm = 'aes192'
        const pass_key = crypto.scryptSync(chunk?.password, 'salt', 24) // Получения ключей на основе пароля, ключ возвращается как Buffer
        const email_key = crypto.scryptSync(chunk?.email, 'salt', 24)
        const iv = Buffer.alloc(16, 0) // Вектор инициализации iv
        
        const cipherPass = crypto.createCipheriv(algorithm, pass_key, iv)
        const cipherEmail = crypto.createCipheriv(algorithm, email_key, iv)

        const encrypted = {
            password: cipherPass.update(chunk?.password, 'utf8', 'hex') + cipherPass.final('hex'),
            email: cipherEmail.update(chunk?.email, 'utf8', 'hex') + cipherEmail.final('hex')
        }

        const signature = this.sign(chunk)

        this.cypherCustomers = {
            meta: {
                source: 'ui',
                signature: signature
            },
            cypher: {
                pass_key: pass_key,
                email_key: email_key,
                algorithm: algorithm,
                iv: iv
            },
            payload: {
                ...chunk,
                ...encrypted
            }
        }

        this.push(this.cypherCustomers)
        done()
    }

    sign(chunk) {
        const sign = crypto.createSign('RSA-SHA256')
        sign.update(JSON.stringify(chunk))
        sign.end()
        return sign.sign(server_key)
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

const guardian = new Guardian(g_options)

const m_options = {
    objectMode: true
}

const manager = new Manager(m_options)

ui.pipe(guardian).pipe(manager)