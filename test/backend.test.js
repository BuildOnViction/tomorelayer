let db, conn, Contract

beforeAll(async () => {
  db = await require('./database')()
  conn = db.conn
  Contract = db.Contract
})

describe('Prequesite confirmation', () => {

  test('#1. verify models', async done => {
    const count = await Contract.count()
    expect(count).toEqual(1)
    done()
  })

})

afterAll(() => conn.close())
