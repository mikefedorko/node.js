// Writable
const { Writable } = require('stream')
const crypto = require('crypto')

const server_cert = `-----BEGIN CERTIFICATE-----
MIICATCCAWoCCQCuCSyS6Uak9jANBgkqhkiG9w0BAQsFADBFMQswCQYDVQQGEwJB
VTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0
cyBQdHkgTHRkMB4XDTE5MDIwNTA5NDkxOFoXDTE5MDMwNzA5NDkxOFowRTELMAkG
A1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0
IFdpZGdpdHMgUHR5IEx0ZDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAtZi9
jNRmE9q1BjTUB1SXRe08ii2D6oL7/VXznYDw4JvBPHncyZIqdWo38pqzg4NJu1Pe
bFDsNbNa/1mcy3SDx4A8Wyx6w20BFlYHUzNqJI3u6Tzmsez4LoRh3dstlhFxgVDV
xtI0Asn6vN5w5d2MCbjyjaYBD888Ym4PI97LimkCAwEAATANBgkqhkiG9w0BAQsF
AAOBgQBoFLPxmm3TL+PBBcXoOGaRbbvGelwXsXgEZCdr+RxMchmbgcKcjc+2+VGa
eiiF3RMGjmz2KtYwg0uv2R331EqBzvmgRnoNH/1tnWmJPylcF2eCzG+NSc4kWNRN
6ZrCfAkaih1l+niEkWeWMTcRns6hTwJ+yrm/ijs0u8nL1XhAkg==
-----END CERTIFICATE-----`

class Manager extends Writable {
    constructor(options = {}) {
        super(options)

        this.descryptedCustomers
        console.log('\n -------- Data in Writable constructor\n ')
    }

    _write({ payload, cypher: { algorithm, pass_key, email_key, iv }, meta }, encoding, done) {
        console.log('Payload:', payload)
    
        const decipherPass = crypto.createDecipheriv(algorithm, pass_key, iv)
        const decipherEmail = crypto.createDecipheriv(algorithm, email_key, iv)

        const password = decipherPass.update(payload.password, 'hex', 'utf8') + decipherPass.final('utf8')
        const email = decipherEmail.update(payload.email, 'hex', 'utf8') + decipherEmail.final('utf8')

        this.descryptedCustomers = {
            name: payload.name,
            email: email,
            password: password
        }

        console.log('Decrypted:',  this.descryptedCustomers)
        this.verify(this.descryptedCustomers, meta.signature)

        done()
    }

    verify(chunk, signature) {
        const verify = crypto.createVerify('RSA-SHA256')
        verify.update(JSON.stringify(chunk))
        verify.end()
        console.log(verify.verify(server_cert, signature)) // true
    }
}

module.exports = Manager;