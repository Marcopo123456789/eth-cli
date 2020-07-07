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
class ListCommand extends Command_1.default {
    constructor(contract, session) {
        super(session);
        this.command = 'list [m]';
        this.description = 'list functions inside Etherless platform';
        this.contract = contract;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = this.session.getAddress();
            const resDesc = args.m ? `Displaying all functions owned by current user: (address: ${address})\n`
                : 'Displaying all functions inside Etherless platform:\n';
            const list = args.m
                ? yield this.contract.getMyFunctions(address)
                : yield this.contract.getAllFunctions();
            return resDesc + (list.length === 0
                ? 'No function found'
                : list.map((item) => `- Function: ${item.name}${item.signature} Price: ${item.price}`).join('\n'));
        });
    }
    builder(yargs) {
        return yargs.option('m', {
            describe: 'Display only functions owns by the current user',
            type: 'boolean',
            default: false,
        });
    }
}
exports.default = ListCommand;
