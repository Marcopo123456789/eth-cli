"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(session) {
        this.command = 'DEFAULT_COMMAND';
        this.description = 'DEFAULT_DESCRIPTION';
        this.session = session;
    }
    /**
     * @method getCommand
     * @returns the command string
     */
    getCommand() {
        return this.command;
    }
    /**
     * @method getDescription
     * @returns the command's description
     */
    getDescription() {
        return this.description;
    }
}
exports.default = Command;
