const { expect } = require('chai');

const { calculate } = require('./estimator');


const previousMonth = {
  cumulative: 20406,
  reading_date: '2018-03-14T00:00:00.000Z',
  unit: 'kWh',
};

const latestMeterReading = {
  cumulative: 20750,
  reading_date: '2018-04-29T00:00:00.000Z',
  unit: 'kWh',
};

const latestMeterReadingEndOfTheMonth = {
  cumulative: 20750,
  reading_date: '2018-04-30T00:00:00.000Z',
  unit: 'kWh',
};

describe('data', () => {
  it('calculates end of the month estimate', () => {
    expect(calculate(latestMeterReading, previousMonth)).to.equal(352);
  });

  it('correctly calculates estimate if last reading was on the last day of the month', () => {
    expect(calculate(latestMeterReadingEndOfTheMonth, previousMonth)).to.equal(344);
  });
});
