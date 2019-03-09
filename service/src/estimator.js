const moment = require('moment');

/**
 * Check whether a moment object is the end of the month.
 * Ignore the time part.
 * @param {moment} mmt
 */
const isEndOfMonth = mmt =>
  // startOf allows to ignore the time component
  // we call moment(mmt) because startOf and endOf mutate the momentj object.
  moment
    .utc(mmt)
    .startOf('day')
    .isSame(moment
      .utc(mmt)
      .endOf('month')
      .startOf('day'));


/**
 * Returns the difference between two moment objects in number of days.
 * @param {moment} mmt1
 * @param {moment} mm2
 */
const getDiffInDays = (mmt1, mm2) => mmt1.diff(mm2, 'days');

/**
 * Return the number of days between the given moment object
 * and the end of the month of this moment object.
 * @param {moment} mmt
 */
const getDaysUntilMonthEnd = mmt => getDiffInDays(moment.utc(mmt).endOf('month'), mmt);

const calculateDailyUsage = (futureDate, pastDate) => {
  const latestDate = futureDate.reading_date;
  const previousMonthDate = pastDate.reading_date;
  const usageDiff = futureDate.cumulative - pastDate.cumulative;
  const daysDiff = getDiffInDays(moment.utc(latestDate), moment.utc(previousMonthDate));
  return Number.parseFloat((usageDiff / daysDiff).toFixed(2));
};

const getEndOfMonthEstimate = (reading, dailyUsage) => {
  if (isEndOfMonth(reading.reading_date)) {
    return reading.cumulative;
  }
  return Math.ceil(reading.cumulative + (getDaysUntilMonthEnd(reading.reading_date) * dailyUsage));
};

const getEndOfMonthDate = mmt => `${moment.utc(mmt).endOf('month').format('YYYY-MM-DD')}T00:00:00.000Z`;

const parse = (dataset) => {
  const result = [];

  dataset.forEach((reading, index) => {
    if (index !== 0) {
      const previousMonth = dataset[index - 1];
      const currentMonth = reading;
      const nextMonth = dataset[index + 1];

      if (nextMonth) {
        const dailyUsage = calculateDailyUsage(nextMonth, previousMonth);
        const previousEndOfMonth = getEndOfMonthEstimate(previousMonth, dailyUsage);
        const currentEndOfTheMonth = getEndOfMonthEstimate(currentMonth, dailyUsage);
        result.push({
          cumulative: (currentEndOfTheMonth - previousEndOfMonth),
          reading_date: getEndOfMonthDate(currentMonth.reading_date),
          unit: 'kWh',
        });
      }
    }
  });
  return result;
};

module.exports = {
  getEndOfMonthEstimate,
  calculateDailyUsage,
  getEndOfMonthDate,
  parse,
};
