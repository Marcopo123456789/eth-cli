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
const inquirer = __importStar(require("inquirer"));
const Command_1 = __importDefault(require("./Command"));
class DeleteCommand extends Command_1.default {
    constructor(contract, session) {
        super(session);
        this.command = 'delete <function_name>';
        this.description = 'delete a function';
        this.contract = contract;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to decrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            const requestId = yield this.contract.sendDeleteRequest(args.function_name);
            const result = yield this.contract.listenResponse(requestId);
            return JSON.parse(result).message;
        });
    }
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function to execute',
            type: 'string',
        });
    }
}
exports.default = DeleteCommand;
