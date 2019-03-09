const sqlite3 = require('sqlite3').verbose();
const sampleData = require('../sampleData.json');

const connection = new sqlite3.Database(':memory:');

function insertRecord(cumulative, readingDate, unit) {
  return new Promise((resolve, reject) => {
    connection.run(
      'INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (?, ?, ?)',
      [cumulative, readingDate, unit],
      error => (error ? reject(error) : resolve()),
    );
  });
}

/**
 * Imports the data from the sampleData.json file into a `meter_reads` table.
 * The table contains three columns - cumulative, reading_date and unit.
 *
 * An example query to get all meter reads,
 *   connection.all('SELECT * FROM meter_reads', (error, data) => console.log(data));
 *
 * Note, it is an in-memory database, so the data will be reset when the
 * server restarts.
 */
function initialize() {
  return new Promise((resolve, reject) => {
    connection.serialize(() => {
      connection.run('CREATE TABLE meter_reads (cumulative INTEGER, reading_date TEXT, unit TEXT)', (error) => {
        if (error) {
          reject(error);
        }
      });

      const { electricity } = sampleData;

      Promise.all(electricity
        .map(({ cumulative, readingDate, unit }) => insertRecord(cumulative, readingDate, unit)))
        .then(resolve)
        .catch(reject);
    });
  });
}

function getAll() {
  return new Promise((resolve, reject) => {
    connection.serialize(() => {
      connection.all('SELECT * FROM meter_reads ORDER BY cumulative', (error, selectResult) => {
        if (error) {
          reject(error);
        }
        resolve(selectResult);
      });
    });
  });
}

module.exports = {
  initialize,
  getAll,
  insertRecord,
  connection,
};
