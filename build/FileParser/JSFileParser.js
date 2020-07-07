"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const Parser = require('acorn');
class JSFileParser {
    parse(path) {
        if (!fs.existsSync(path)) {
            throw new Error('File doesn\'t exists');
        }
        this.parsedFile = Parser.parse(fs.readFileSync(path).toString());
    }
    existsFunction(funcName) {
        if (typeof this.parsedFile === 'undefined') {
            throw new Error('No file loaded');
        }
        return this.findFuncNode(funcName) !== undefined;
    }
    getFunctionSignature(funcName) {
        if (typeof this.parsedFile === 'undefined') {
            throw new Error('No file loaded');
        }
        if (!this.existsFunction(funcName)) {
            throw new Error(`No function ${funcName} found in file`);
        }
        const funcNode = this.findFuncNode(funcName);
        const funcParams = this.funcSignatureFromNode(funcNode);
        return `(${funcParams})`;
    }
    findFuncNode(funcName) {
        return this.parsedFile.body.find((x) => x.id.name === funcName);
    }
    funcSignatureFromNode(funcNode) {
        return funcNode.params.map((param) => param.name).join(', ');
    }
}
exports.default = JSFileParser;
