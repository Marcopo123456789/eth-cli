"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
class IPFSFileManager {
    constructor(ipfsObj) {
        this.ipfs = ipfsObj;
    }
    /**
    * @returns The IPFS CID related to the uploaded JSON
    * @param buffer The buffer you want to save to IPFS
    */
    save(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.ipfs.add(buffer.toString('hex'))
                    .then(resolve)
                    .catch((error) => {
                    reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
                });
            });
        });
    }
    /**
    * @returns The JSON object corresponding to the given CID
    * @param {*} hash The IPFS CID has you want to get the JSON
    */
    get(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.ipfs.cat(cid)
                    .then((result) => resolve(Buffer.from(result, 'hex')))
                    .catch((error) => {
                    reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
                });
            });
        });
    }
}
exports.default = IPFSFileManager;
