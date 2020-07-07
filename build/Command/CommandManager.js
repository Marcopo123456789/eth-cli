"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
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
