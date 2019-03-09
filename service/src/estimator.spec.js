const { expect } = require('chai');

const {
  calculateDailyUsage,
  getEndOfMonthEstimate,
  getEndOfMonthDate,
  parse,
} = require('./estimator');


const sampleEstimates = require('../sampleEstimates');
const sampleDbData = require('../sampleDbData');

const previousMonth = {
  cumulative: 20406,
  reading_date: '2018-03-14T00:00:00.000Z',
  unit: 'kWh',
};

const latestMeterReadingOneDayLeft = {
  cumulative: 20750,
  reading_date: '2018-04-29T00:00:00.000Z',
  unit: 'kWh',
};

const latestMeterReadingTenDaysLeft = {
  cumulative: 20750,
  reading_date: '2018-04-20T00:00:00.000Z',
  unit: 'kWh',
};

const latestMeterReadingEndOfTheMonth = {
  cumulative: 20750,
  reading_date: '2018-04-30T00:00:00.000Z',
  unit: 'kWh',
};

describe('data', () => {
  it('can parse a data set', () => {
    expect(parse(sampleDbData)).to.deep.equal(sampleEstimates);
  });

  it('calculates daily usage of the month estimate', () => {
    expect(calculateDailyUsage(latestMeterReadingOneDayLeft, previousMonth)).to.equal(7.48);
    expect(calculateDailyUsage(latestMeterReadingTenDaysLeft, previousMonth)).to.equal(9.3);
    expect(calculateDailyUsage(latestMeterReadingEndOfTheMonth, previousMonth)).to.equal(7.32);
  });

  it('calculates end of the month estimate', () => {
    expect(getEndOfMonthEstimate(latestMeterReadingOneDayLeft, 10)).to.equal(20760);
    expect(getEndOfMonthEstimate(latestMeterReadingTenDaysLeft, 10)).to.equal(20850);
    expect(getEndOfMonthEstimate(latestMeterReadingEndOfTheMonth, 10)).to.equal(20750);
  });

  it('calculates end of the month date', () => {
    expect(getEndOfMonthDate(latestMeterReadingTenDaysLeft.reading_date)).to.equal('2018-04-30T00:00:00.000Z');
    expect(getEndOfMonthDate(latestMeterReadingEndOfTheMonth.reading_date)).to.equal('2018-04-30T00:00:00.000Z');
  });
});
