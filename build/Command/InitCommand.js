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
class InitCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.command = 'init';
        this.description = 'Functionality showcase';
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Welcome to ehterless-cli \nList of commands, use etherless <command name>: \n>login \n>logout \n>signup \n>whoami';
        });
    }
    builder(yargs) {
        return {};
    }
}
exports.default = InitCommand;
