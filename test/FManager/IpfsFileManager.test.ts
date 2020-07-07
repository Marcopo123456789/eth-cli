import IPFSFileManager from '../../src/IPFS/IPFSFileManager';

jest.mock('ipfs-mini');

const IPFS = require('ipfs-mini');

const ipfsMiniMock = new IPFS.Ipfs();
const ipfsManager : IPFSFileManager = new IPFSFileManager(ipfsMiniMock);

test('get correctly returns result', async () => {
  const buff = await ipfsManager.get('CID');
  expect(buff).toBeInstanceOf(Buffer);
  expect(buff.toString('utf-8')).toEqual('data from CID');
});

test('get correctly manages exception', async () => {
  ipfsMiniMock.cat = jest.fn().mockImplementationOnce(
    () => Promise.reject(new Error('some ipfs error')),
  );

  try {
    await ipfsManager.get('some CID');
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});

test('saveOnIpfs correctly returns result', async () => {
  const path = await ipfsManager.save(Buffer.from('save this on IPFS'));
  expect(path).toBe('mocked CID');
});

test('saveOnIpfs correctly manages exception', async () => {
  ipfsMiniMock.add = jest.fn().mockImplementationOnce(
    () => Promise.reject(new Error('Unable to upload file on IPFS')),
  );

  try {
    await ipfsManager.save(Buffer.from('save this on IPFS'));
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});
