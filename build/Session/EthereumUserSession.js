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
class EthereumUserSession {
    constructor(conf, provider) {
        this.conf = conf;
        this.provider = provider;
    }
    saveWallet(password, wallet) {
        wallet.encrypt(password).then((encryptedJson) => {
            this.conf.set(EthereumUserSession.WALLET_KEY, encryptedJson);
        });
        this.conf.set(EthereumUserSession.ADDRESS_KEY, wallet.address);
    }
    isLogged() {
        return this.conf.get(EthereumUserSession.WALLET_KEY) !== null
            && this.conf.get(EthereumUserSession.WALLET_KEY) !== undefined;
    }
    loginWithPrivateKey(privateKey, password) {
        if (this.isLogged()) {
            throw new Error('You are already logged in!');
        }
        const wallet = new ethers_1.Wallet(privateKey);
        this.saveWallet(password, wallet);
        return wallet;
    }
    loginWithMnemonicPhrase(mnemonic, password) {
        if (this.isLogged()) {
            throw new Error('You are already logged in!');
        }
        const wallet = ethers_1.Wallet.fromMnemonic(mnemonic);
        this.saveWallet(password, wallet);
        return wallet;
    }
    signup() {
        return ethers_1.Wallet.createRandom();
    }
    logout() {
        if (this.isLogged()) {
            this.conf.delete(EthereumUserSession.WALLET_KEY);
        }
        else {
            throw new Error('You are not logged in!');
        }
    }
    restoreWallet(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLogged()) {
                const wallet = yield ethers_1.Wallet.fromEncryptedJson(this.conf.get(EthereumUserSession.WALLET_KEY), password);
                return wallet.connect(this.provider);
            }
            throw new Error('No wallet found');
        });
    }
    getAddress() {
        if (this.isLogged()) {
            return this.conf.get(EthereumUserSession.ADDRESS_KEY);
        }
        throw new Error('No user logged in');
    }
}
EthereumUserSession.WALLET_KEY = 'criptedWallet';
EthereumUserSession.ADDRESS_KEY = 'walletAddress';
exports.default = EthereumUserSession;
