const { expect } = require('chai');

const data = require('./data');
const sampleData = require('../sampleData.json');

describe('data', () => {
  beforeEach(() => data.initialize());
  afterEach(() => data.connection.serialize(() => {
    data.connection.run('DROP TABLE meter_reads', (error) => {
      if (error) {
        throw error;
      }
    });
  }));

  it('initialize should import the data from the sampleData file', (done) => {
    data.connection.serialize(() => {
      data.connection.all('SELECT * FROM meter_reads ORDER BY cumulative', (error, selectResult) => {
        expect(error).to.be.null;
        expect(selectResult).to.have.length(sampleData.electricity.length);
        selectResult.forEach((row, index) => {
          expect(row.cumulative).to.equal(sampleData.electricity[index].cumulative);
        });
        done();
      });
    });
  });

  it('getAll should return all the data from database', async () => {
    const result = await data.getAll();
    expect(result).to.have.length(sampleData.electricity.length);
    result.forEach((row, index) => {
      expect(row.cumulative).to.equal(sampleData.electricity[index].cumulative);
    });
  });

  it('insertRecord should insert a new record to database', async () => {
    await data.insertRecord(30000, 'date', 'kWh');
    const results = await data.getAll();
    const result = results.pop();
    expect(result).to.deep.equal({
      cumulative: 30000,
      reading_date: 'date',
      unit: 'kWh',
    });
  });
});
