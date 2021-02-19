const EventEmitter = require('events')

class Bank extends EventEmitter {
    constructor() {
        super()
        this.prevName = ''
        // this.user = new Map()
    }

    register(personId) {
        console.log(this.user)
        if(personId.name !== this.prevName) {
            this.prevName = personId.name
        } else {
            this.emit('error', 'Agents have same names')
        }
        
        if(personId.balance <= 0) this.emit('error', 'Please increase your balance')

        this.on('add', (person, creditedAmount) => {
            if(creditedAmount <= 0 ) this.emit('error', `Please add more then ${creditedAmount}₴`)
            person.balance = person.balance + creditedAmount
            console.log(`Added ${creditedAmount}₴ to ${person.name}`)
        })

        this.on('get', (person, callback) => {
            callback(person.balance)
        })

        this.on('withdraw', (person = {}, withdrawalAmount) => {
            if(withdrawalAmount < 0 ) this.emit('error', `Please increase your withdraw`)
            personId.balance = personId.balance - withdrawalAmount
            console.log(`Withdraw ${withdrawalAmount}₴ from ${person.name}`)
            if(personId.balance < 0 ) this.emit('error', `Please decrease ${withdrawalAmount}₴`)
        })

        this.on('send', (firstPerson, secondPerson, sendAmount) => {
            if(firstPerson.balance >= sendAmount) {
                secondPerson.balance = secondPerson.balance + sendAmount
                firstPerson.balance = firstPerson.balance - sendAmount
                console.log(`${sendAmount}₴ sent from ${firstPerson.name} to ${secondPerson.name}`)
            } else {
                this.emit('error', 'Balance to small')
            }
            
        })

        return personId
    }

    end() {
        this.removeAllListeners()
    }
}

const bank = new Bank()

// First agent
const personId = bank.register({ 
    name: 'Pitter Black', 
    balance: 100
})
// Logic for personId
bank.emit('add', personId, 20) // { name: 'Pitter Black', balance: 120 }
bank.emit('get', personId, (balance) => {
    console.log(`${personId.name} have ${balance}₴`) // 120₴ 
}) 
bank.emit('withdraw', personId, 50)
bank.emit('get', personId, (balance) => {
    console.log(`${personId.name} have ${balance}₴`) // 70₴ 
})

bank.end()


// Second agent
const personSecondId = bank.register({ 
    name: 'Denny Brown',
    balance: 60
})
// Logic for personSecondId
bank.emit('add', personSecondId, 30)
bank.emit('get', personSecondId, (balance) => {
    console.log(`${personSecondId.name} have ${balance}₴`) // 90₴ 
}) 
bank.emit('withdraw', personSecondId, 50)
bank.emit('get', personSecondId, (balance) => {
    console.log(`${personSecondId.name} have ${balance}₴`) // 40₴ 
}) 

// Send logic
bank.emit('send', personId, personSecondId, 55)
bank.emit('get', personSecondId, (balance) => {
    console.log(`${personSecondId.name} have ${balance}₴`) // 40₴ 
}) 
bank.emit('get', personId, (balance) => {
    console.log(`${personId.name} have ${balance}₴`) // 70₴ 
})

bank.end()