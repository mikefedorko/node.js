const { Bank } = require('.')

jest.mock('events')

describe('Bank test:', () => {
    const _ = new Bank()

    describe('_checkForDuplicates', () => {
        test('register should be defined', () => {
            expect(_.register).toBeDefined()
        })

        test('register should return id and it should be a number', () => {
            const id = _.register({
                name: 'Nick',
                balance: 11111,
            })

            expect(typeof id).toBe('number')
        })

        // Amount
        test('check amount', () => {
            const id = _.register({
                name: 'Mike',
                balance: 222,
            })

            expect(() => _.emit('add', id, 0)).toThrowError('amount should be grater than 0');
        });
    
        test('throw error for invalid user id', () => {
            expect(() => _.emit('add', 123, -100)).toThrowError('customer with id "123" not found');
        });
    
        test('emit error should throw error', () => {
            expect(() => _.emit('error', { message: 'some Error' })).toThrowError('some Error');
        })
    })

   
})