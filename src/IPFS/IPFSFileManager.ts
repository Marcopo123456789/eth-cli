import FileManager from './FileManager';

const fs = require('fs');

class IPFSFileManager implements FileManager {
  private ipfs : any;

  constructor(ipfsObj : any) {
    this.ipfs = ipfsObj;
  }

  /**
  * @returns The IPFS CID related to the uploaded JSON
  * @param buffer The buffer you want to save to IPFS
  */
  public async save(buffer: Buffer) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.ipfs.add(buffer.toString('hex'))
        .then(resolve)
        .catch((error : Error) => {
          reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
        });
    });
  }

  /**
  * @returns The JSON object corresponding to the given CID
  * @param {*} hash The IPFS CID has you want to get the JSON
  */
  public async get(cid : string) : Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.ipfs.cat(cid)
        .then((result : string) => resolve(Buffer.from(result, 'hex')))
        .catch((error : Error) => {
          reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
        });
    });
  }
}


export default IPFSFileManager;
