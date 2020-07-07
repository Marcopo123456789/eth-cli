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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inquirer = __importStar(require("inquirer"));
const Command_1 = __importDefault(require("./Command"));
class LoginCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.command = 'login [m] <value..>';
        this.description = 'login inside Ethereum network';
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield Inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to encrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            const value = args.value.join(' ');
            const wallet = args.m
                ? this.session.loginWithMnemonicPhrase(value, password)
                : this.session.loginWithPrivateKey(value, password);
            return `Login successfully done within the Ethereum network with address ${wallet.address}`;
        });
    }
    builder(yargs) {
        return yargs.positional('value', {
            describe: 'Value to access the wallet, it can be a private key or mnemonic phrase',
        }).option('m', {
            describe: 'If true value must be a mnemonic phrase',
            type: 'boolean',
        });
    }
}
exports.default = LoginCommand;
