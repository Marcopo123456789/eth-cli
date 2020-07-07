export default interface FileParser {
  parse(path : string) : void;
  existsFunction(name: string) : boolean;
  getFunctionSignature(name: string) : string;
}
