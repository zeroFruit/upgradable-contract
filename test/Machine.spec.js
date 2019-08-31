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
const CalculatorFactory = artifacts.require('Calculator');
const MachineFactory = artifacts.require('Machine');

contract('Storage', accounts => {
  const [owner, ...others] = accounts;

  describe('#constructor()', () => {
    it('should successfully initialize', async () => {
      const Storage = await StorageFactory.new(new BN('0'));
      const Machine = await MachineFactory.new(Storage.address);

      (await Machine.s()).should.be.equal(Storage.address);
    });
  });

  describe('After initalize', () => {
    let Storage, Machine;

    beforeEach(async () => {
      Storage = await StorageFactory.new(new BN('0'));
      Machine = await MachineFactory.new(Storage.address);
    });

    describe('#saveValue()', () => {
      it('should successfully save value', async () => {
        await Machine.saveValue(new BN('54'));
        (await Storage.val()).should.be.bignumber.equal(new BN('54'));
      });
    });

    describe('#delegateCallAddValues()', () => {
      let Calculator;
      beforeEach(async () => {
        Calculator = await CalculatorFactory.new();
      });
      it.only('should successfully add values with delegate call', async () => {
        const result = await Machine.addValuesWithDelegateCall(Calculator.address, new BN('1'), new BN('2'));

        expectEvent.inLogs(result.logs, 'AddedValuesByDelegateCall', {
          a: new BN('1'),
          b: new BN('2'),
          success: true,
        });

        (result.receipt.from).should.be.equal(owner.toString().toLowerCase());
        (result.receipt.to).should.be.equal(Machine.address.toString().toLowerCase());

        // Calculator storage DOES NOT CHANGE!
        (await Calculator.calculateResult()).should.be.bignumber.equal(new BN('0'));

        // Only calculateResult in Machine contract should be changed
        (await Machine.calculateResult()).should.be.bignumber.equal(new BN('3'));

        (await Machine.user()).should.be.equal(owner);

      });
    });
  })
});
