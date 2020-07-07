import FileParser from './FileParser';

const fs = require('fs');
const Parser = require('acorn');

class JSFileParser implements FileParser {
  private parsedFile : any | undefined;

  parse(path : string) {
    if (!fs.existsSync(path)) {
      throw new Error('File doesn\'t exists');
    }

    this.parsedFile = Parser.parse(fs.readFileSync(path).toString());
  }

  public existsFunction(funcName: string) : boolean {
    if (typeof this.parsedFile === 'undefined') {
      throw new Error('No file loaded');
    }

    return this.findFuncNode(funcName) !== undefined;
  }

  public getFunctionSignature(funcName: string) : string {
    if (typeof this.parsedFile === 'undefined') {
      throw new Error('No file loaded');
    }

    if (!this.existsFunction(funcName)) {
      throw new Error(`No function ${funcName} found in file`);
    }

    const funcNode : any = this.findFuncNode(funcName);
    const funcParams : string = this.funcSignatureFromNode(funcNode);
    return `(${funcParams})`;
  }

  private findFuncNode(funcName: string) : any {
    return this.parsedFile.body.find((x : any) => x.id.name === funcName);
  }

  private funcSignatureFromNode(funcNode: any) : string {
    return funcNode.params.map((param : any) => param.name).join(', ');
  }
}

export default JSFileParser;
