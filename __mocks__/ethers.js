jest.genMockFromModule('ethers');

const ethers = {

  getDefaultProvider: jest.fn(),

  Contract: jest.fn().mockImplementation(() => ({
    getFuncList: jest.fn(),
    getOwnedList: jest.fn(),
    getInfo: jest.fn(),

    removeAllListeners: jest.fn().mockImplementation(() => {}),

    runFunction: jest.fn().mockImplementation((name, params, options) => Promise.resolve(({
      wait: jest.fn().mockImplementation(() => Promise.resolve(({
        events: ['mockEvent0', 'mockEvent1', 'mockEvent2'],
      }))),
    }))),

    deployFunction: jest.fn()
      .mockImplementation((name, signature, desc, cid, options) => Promise.resolve(({
        wait: jest.fn().mockImplementation(() => Promise.resolve(({
          events: ['mockEvent0', 'mockEvent1', 'mockEvent2'],
        }))),
      }))),

    deleteFunction: jest.fn().mockImplementation((name, params, options) => Promise.resolve(({
      wait: jest.fn().mockImplementation(() => Promise.resolve(({
        events: ['mockEvent0', 'mockEvent1', 'mockEvent2'],
      }))),
    }))),

    on: jest.fn().mockImplementation(),

    interface: jest.fn().mockImplementation(() => ({
      parseLog: jest.fn().mockImplementation(() => ({
        interface: jest.fn().mockImplementation(() => ({
          values: { id: 0 },
        })),
      })),
    })),
  })),

  Wallet: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockImplementation((provider) => Promise.resolve(new this.Wallet())),
    encrypt: jest.fn().mockImplementation((wallet) => Promise.resolve('encryptedWallet')),
  })),
};

module.exports = ethers;
