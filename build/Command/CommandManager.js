"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
class CommandManager {
    /**
     * @param command: to be added to managed commands
     */
    static addCommand(command) {
        yargs.command(command.getCommand(), command.getDescription(), command.builder, (args) => {
            command.exec(args)
                .then((result) => console.log(`${result}`))
                .catch((error) => {
                console.log(`Something went wrong! \nError name: ${error.name} \nMessage: ${error.message}`);
                if (error.reason)
                    console.log(`Reason: ${error.reason}`);
            });
        });
    }
    /**
     * @description: finish initalization of yargs, after this the CLI is ready
     *               to manage all added commands
     */
    static init() {
        yargs.parse();
    }
}
exports.default = CommandManager;
