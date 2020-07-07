jest.genMockFromModule('ipfs-mini');

const IPFS = {
  Ipfs: jest.fn().mockImplementation(() => ({
    cat: jest.fn((cid) => Promise.resolve(Buffer.from(`data from ${cid}`))),
    add: jest.fn((data) => Promise.resolve('mocked CID')),
  })),
};

module.exports = IPFS;
