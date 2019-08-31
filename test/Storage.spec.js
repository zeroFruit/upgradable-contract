const {
  shouldFail,
  constants,
  expectEvent,
  BN
} = require('openzeppelin-test-helpers');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();


const StorageFactory = artifacts.require('Storage');

contract('Storage', accounts => {
  const [owner, user, sender, receiver, ...others] = accounts;

  describe('#constructor()', () => {
    it('should successfully initalize value', async () => {
      const Storage = await StorageFactory.new(new BN('0'));
      (await Storage.val()).should.be.bignumber.equal(new BN('0'));
    });
  });

  describe('After initialize', () => {
    let Storage;

    beforeEach(async () => {
      Storage = await StorageFactory.new(new BN('0'));
    });

    describe('#setValue()', () => {
      it('should successfully set value', async () => {
        await Storage.setValue(new BN('54'));
        (await Storage.val()).should.be.bignumber.equal(new BN('54'));
      })
    });
  });
});
