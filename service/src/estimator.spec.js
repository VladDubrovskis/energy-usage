const { expect } = require('chai');

const { calculate, parse } = require('./estimator');


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

const dataset = [
  {
    cumulative: 17580,
    reading_date: '2017-03-28T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 17759,
    reading_date: '2017-04-15T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 18002,
    reading_date: '2017-05-08T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 18270,
    reading_date: '2017-06-18T00:00:00.000Z',
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
    cumulative: 18682,
    reading_date: '2017-09-10T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 18905,
    reading_date: '2017-10-27T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 19150,
    reading_date: '2017-11-04T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 19667,
    reading_date: '2017-12-31T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 19887,
    reading_date: '2018-01-23T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 20290,
    reading_date: '2018-02-19T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 20406,
    reading_date: '2018-03-14T00:00:00.000Z',
    unit: 'kWh',
  },
  {
    cumulative: 20750,
    reading_date: '2018-04-29T00:00:00.000Z',
    unit: 'kWh',
  },
];

describe('data', () => {
  it('can parse a data set', () => {
    expect(parse(dataset)).to.deep.equal([
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
  it('calculates end of the month estimate', () => {
    expect(calculate(latestMeterReadingOneDayLeft, previousMonth)).to.equal(352);
    expect(calculate(latestMeterReadingTenDaysLeft, previousMonth)).to.equal(437);
  });

  it('correctly calculates estimate if last reading was on the last day of the month', () => {
    expect(calculate(latestMeterReadingEndOfTheMonth, previousMonth)).to.equal(344);
  });
});
