const { expect } = require('chai');
const request = require('supertest');

const data = require('./data');
const server = require('./index');
const sampleData = require('../sampleData.json');

let instance;

describe('index', () => {
    before((done) => {
        data.initialize().then(() => {
            instance = server().listen(process.env.TEST_SERVER_PORT || 8888);
            done();
        })
    });
    after(() => { instance.close() })

    it('retrieve a list of meter readings from the database', async () => {
        const response = await request(instance).get('/');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(sampleData.electricity);
    });

});
