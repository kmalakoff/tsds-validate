const assert = require('assert');
const validate = require('tsds-validate');

describe('exports .cjs', () => {
  it('defaults', () => {
    assert.equal(typeof validate, 'function');
  });
});
