import { Wallet } from 'ethers';
import { BigNumber } from 'ethers/utils';
import Function from './Function';
import BriefFunction from './BriefFunction';
import HistoryItem from './HistoryItem';

export default interface EtherlessContract {
  getAllFunctions() : Promise<Array<BriefFunction>>;
  getMyFunctions(address : string) : Promise<Array<BriefFunction>>;
  getFunctionInfo(name : string) : Promise<Function>;
  getExecHistory(address : string) : Promise<Array<HistoryItem>>;
  // existsFunction(name : string) : Promise<boolean>;

  updateDesc(name: string, params: string) : Promise<void>;
  connect(wallet : Wallet) : void;

  sendRunRequest(name : string, params: string) : Promise<BigNumber>;
  sendDeleteRequest(name: string) : Promise<BigNumber>;
  sendCodeUpdateRequest(name: string, signature: string, cid: string) : Promise<BigNumber>;
  sendDeployRequest(name: string, signature: string, desc : string, cid: string)
    : Promise<BigNumber>;

  listenResponse(requestId : BigNumber) : Promise<string>;
}
