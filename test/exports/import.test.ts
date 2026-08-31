import assert from 'assert';
import validate from 'tsds-validate';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof validate, 'function');
  });
});
