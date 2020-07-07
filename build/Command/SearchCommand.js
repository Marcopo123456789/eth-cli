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
class SearchCommand extends Command_1.default {
    constructor(contract, session) {
        super(session);
        this.command = 'search <keyword>';
        this.description = 'list all functions having a keyword inside their name';
        this.contract = contract;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const resIntro = `Functions containing keyword "${args.keyword}" inside their name: \n`;
            const list = yield this.contract.getAllFunctions();
            const filteredList = list.filter((item) => item.name.includes(args.keyword));
            return resIntro + (filteredList.length === 0
                ? 'No function found'
                : filteredList.map((item) => `- Function: ${item.name}${item.signature} Price: ${item.price}`).join('\n'));
        });
    }
    builder(yargs) {
        return yargs.positional('keyword', {
            describe: 'Keyword to find inside functions name',
            type: 'string',
        });
    }
}
exports.default = SearchCommand;
