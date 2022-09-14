import * as fcl from "@onflow/fcl";
import { getAddressAndPublicKey, signTransaction } from "../kms/KmsDevice.js";

export const authorization = async (account = {}) => {

  // Retrieve address and public key from google kms
  // const {publicKey, address, returnCode, errorMessage }

  const deviceAccountInfo = await getAddressAndPublicKey();
  console.log(deviceAccountInfo);

  if (deviceAccountInfo.returnCode !== 0x9000) {
    console.error("Failure retrieving address/public key from google kms system");
    return;
  }


  // Determine key index and sequence number from chain
  var getAccountResponse = await fcl.send(fcl.getAccount(deviceAccountInfo.address));
  var getAccountData = await fcl.decode(getAccountResponse);
  console.log(getAccountData);

  // TODO: Determine keyId and sequence number based on public key

  const keyId = 1;
  let sequenceNum = 0;

  if (account.role.proposer) {
    const response = await fcl.send([fcl.getAccount(deviceAccountInfo.address)]);
    const acct = await fcl.decode(response);
    sequenceNum = acct.keys[keyId].sequenceNumber;
  }

  const signingFunction = async (data) => {
    const signature = await signTransaction(data);
    return {
      address: deviceAccountInfo.address,
      keyId,
      signature: signature,
    };
  };

  return {
    ...account,
    address: deviceAccountInfo.address,
    keyId,
    signingFunction,
    sequenceNum
  };
};