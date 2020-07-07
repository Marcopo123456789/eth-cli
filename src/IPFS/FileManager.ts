export default interface FileManager {
  save(data : Buffer) : Promise<string>;
  get(CID : string) : Promise<Buffer>;
}
