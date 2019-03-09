const { expect } = require('chai');
const request = require('supertest');

const server = require('./index');

let instance;

describe('index', () => {
  before(() => { instance = server().listen(process.env.TEST_SERVER_PORT || 8888) })
  after(() => { instance.close() })

  it('should have return welcome message on root path', async () => {
    const response = await request(instance).get("/");
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Hello world');
  });


});
