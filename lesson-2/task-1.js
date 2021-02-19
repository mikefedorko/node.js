const t1 = {
    name: 't1',
    delay: 1000,
    interval: true,
    job: (count, name) => console.log(`Count ${count}: object - ${name}`)
}
const t2 = {
    name: 't2',
    delay: 2000, 
    interval: true,
    job: (count, name) => console.log(`Count ${count}: object - ${name}`)
}

const t3 = {
    name: 't3',
    delay: 1000, 
    interval: false,
    job: (count, name) => console.log(`Count ${count}: object - ${name}`)
}

class TimersManager {
    constructor() {
        this.timers = []
        this.interval = null
        this.pauseTimeout = null
    }
    
    add(timer) {
        this.timers.push(timer)
        console.log(`Timers ${timer.name} added`)
        return this
    }

    remove(name) {
        const arr = this.timers.filter(timer => name !== timer.name)
        this.timers = arr
        console.log(`Timer ${name} removed`)
    }

    start() {
        if(!this.timers.length) throw '(manager.add) method run after (manager.start)'
        // Для одноразовых таймеров
        // this.interval = this.timers.forEach((obj, index) => {
        //     setTimeout(() => {
        //         console.log(obj)
        //     }, obj.delay * (index + 1))
        // }) 
        let count = 0
        setTimeout((startText) => {
            console.log(startText)
        }, 10, `Timers start, status: ${this.state}`)
        
        this.interval = setInterval(() => {
            let obj = this.timers[count]
            obj.job(count, obj.name)
            
            if(count === (this.timers.length - 1)) {
                count = -1
            } 
            
            count++
        }, 1000)
    }

    stop() {
        setTimeout((stopText) => {
            clearInterval(this.interval)
            this.state = 0
            console.log(stopText)
        }, 12000, `Timers stop, status`)
    }

    pause(name, delay) {
        this.pauseTimeout= setTimeout(() => {
            this.timers.find(timer => {
                if(timer.name === name) {
                    timer.job = () => console.log(`Timer ${name} on pause`)
                }
            })
            
        }, delay)
    }

    resume(name, delay) {
        setTimeout(() => {
            this.timers.find((timer, index) => {
                if(timer.name === name) {
                    timer.job = () => console.log(`Count ${index}: object - ${name}`)
                }
            })
        }, delay)
    } 
}
const manager = new TimersManager()

// Add timers to queue
manager.add(t1).add(t3).add(t2)

// Start all timers
manager.start() // setInterval goes after sync code

// Stop the set timer and remove from queue
manager.remove('t3') // String

// Stop all timers
manager.stop()

// Pause current timer
manager.pause('t2', 3000)

// Resume current timer 
manager.resume('t2', 8000)

// Log timers
console.log('Timers:', manager.timers)