import assert from 'assert';
import validate from 'tsds-validate';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof validate, 'function');
  });
});
