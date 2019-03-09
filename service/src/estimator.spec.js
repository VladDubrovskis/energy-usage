const { expect } = require('chai');

const { calculate } = require('./estimator');

describe('data', () => {
  it('passes sanity check', () => {
    expect(calculate()).to.equal(true);
  });
});
