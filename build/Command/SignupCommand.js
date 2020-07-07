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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Command"));
const fs = require('fs');
class SignupCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.command = 'signup [save]';
        this.description = 'create a new account';
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this.session.signup();
            if (args.save) {
                fs.writeFileSync('./credential.txt', `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`);
            }
            return `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`;
        });
    }
    builder(yargs) {
        return yargs.option('save', {
            describe: 'Decide if save credentials in file',
            type: 'boolean',
            default: false,
        });
    }
}
exports.default = SignupCommand;
