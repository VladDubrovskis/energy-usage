const moment = require('moment');

/**
 * Check whether a moment object is the end of the month.
 * Ignore the time part.
 * @param {moment} mmt
 */
function isEndOfMonth(mmt) {
  // startOf allows to ignore the time component
  // we call moment(mmt) because startOf and endOf mutate the momentj object.
  return moment
    .utc(mmt)
    .startOf('day')
    .isSame(moment
      .utc(mmt)
      .endOf('month')
      .startOf('day'));
}

/**
 * Returns the difference between two moment objects in number of days.
 * @param {moment} mmt1
 * @param {moment} mm2
 */
function getDiffInDays(mmt1, mm2) {
  return mmt1.diff(mm2, 'days');
}

/**
 * Return the number of days between the given moment object
 * and the end of the month of this moment object.
 * @param {moment} mmt
 */
function getDaysUntilMonthEnd(mmt) {
  return getDiffInDays(moment.utc(mmt).endOf('month'), mmt);
}

const calculate = (latest, previousMonth) => {
  const latestDate = latest.reading_date;
  const previousMonthDate = previousMonth.reading_date;
  const usageSinceLast = latest.cumulative - previousMonth.cumulative;
  if (isEndOfMonth(latestDate)) {
    return usageSinceLast;
  }
  const daysSinceLast = getDiffInDays(moment.utc(latestDate), moment.utc(previousMonthDate));
  const daysLeft = getDaysUntilMonthEnd(latestDate);
  const dailyUsage = usageSinceLast / daysSinceLast;
  return Math.ceil(usageSinceLast + (daysLeft * dailyUsage));
};

module.exports = {
  calculate,
};
