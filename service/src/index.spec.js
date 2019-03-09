const { expect } = require('chai');
const request = require('supertest');
const moment = require('moment');

const data = require('./data');
const server = require('./index');
const sampleData = require('../sampleData.json');

let instance;

describe('index', () => {
  beforeEach((done) => {
    data.initialize().then(() => {
      instance = server().listen(process.env.TEST_SERVER_PORT || 8888);
      done();
    });
  });
  afterEach(() => {
    instance.close();
    data.connection.run('DROP TABLE meter_reads', (error) => {
      if (error) {
        throw error;
      }
    });
  });

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

  it('retrieve an estimate based on seed data', async () => {
    const response = await request(instance).get('/usage');
    expect(response.status).to.equal(200);
    expect(response.header['content-type']).to.match(/application\/json/);
    expect(response.body.estimate).to.deep.equal([
      {
        cumulative: 17859,
        reading_date: '2017-04-30T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18102,
        reading_date: '2017-05-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18290,
        reading_date: '2017-06-30T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18453,
        reading_date: '2017-07-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18620,
        reading_date: '2017-08-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18782,
        reading_date: '2017-09-30T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 18965,
        reading_date: '2017-10-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 19230,
        reading_date: '2017-11-30T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 19517,
        reading_date: '2017-12-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 19827,
        reading_date: '2018-01-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 20113,
        reading_date: '2018-02-28T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 20376,
        reading_date: '2018-03-31T00:00:00.000Z',
        unit: 'kWh',
      },
      {
        cumulative: 20610,
        reading_date: '2018-04-30T00:00:00.000Z',
        unit: 'kWh',
      },
    ]);
  });
});
