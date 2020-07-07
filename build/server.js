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
const ethers_1 = require("ethers");
const ESmart = require('../contracts/EtherlessSmart.json');
const func = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = new ethers_1.Wallet('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635', ethers_1.getDefaultProvider('ropsten'));
    const contract = new ethers_1.Contract('0x5f95F9FC6345C8f6CC94D154e3C6212722660146', ESmart.abi, ethers_1.getDefaultProvider('ropsten')).connect(wallet);
    contract.on('runRequest', (funcName, param, id) => {
        console.log(id);
        contract.resultFunction('100', id, { gasLimit: 750000 }).then((tx) => tx.wait());
    });
});
func();
