const { expect } = require('chai');
const request = require('supertest');
const moment = require('moment');

const data = require('./data');
const server = require('./index');
const sampleData = require('../sampleData.json');

let instance;

describe('index', () => {
  before((done) => {
    data.initialize().then(() => {
      instance = server().listen(process.env.TEST_SERVER_PORT || 8888);
      done();
    });
  });
  after(() => { instance.close(); });

  it('retrieve a list of meter readings from the database', async () => {
    const response = await request(instance).get('/');
    expect(response.status).to.equal(200);
    expect(response.header['content-type']).to.match(/application\/json/);
    expect(response.body).to.deep.equal(sampleData.electricity);
  });

  it('add a new meter reading that gets stored in the database', async () => {
    const timestamp = `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`;
    await request(instance)
      .post('/')
      .send({ cumulative: 21000 })
      .set('Accept', 'application/json')
      .expect(200);

    const expectation = sampleData.electricity.slice();
    expectation.push({
      cumulative: 21000,
      readingDate: timestamp,
      unit: 'kWh',
    });

    const getDataResponse = await request(instance).get('/');
    expect(getDataResponse.status).to.equal(200);
    expect(getDataResponse.header['content-type']).to.match(/application\/json/);
    expect(getDataResponse.body).to.deep.equal(expectation);
  });
});
