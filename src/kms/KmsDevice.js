import { convert, getDigest, convertTxToGcpPayload, getPayloadOnly } from "../common/utils";
import * as sdk from "@onflow/sdk"
export const getVersion = async () => {
  let major = 0;
  let minor = 0;
  let patch = 0;


  return `${major}.${minor}.${patch}`
};

export const appInfo = async () => {
  // get app info
};

export const getAddressAndPublicKey = async () => {
  console.log("KMS.getAddressAndPublicKey")

  try {
    // todo: implement this. get kms public key and convert to flow public key
    console.log("Not Implemented")
    // get all accounts public key is associated.
  } finally {

  }


  console.log("TODO: get accounts and publick key")
  // TODO: get real info
  return {
    address: "display address",
    publicKey: "display public key",
  };
};

export const showAddressAndPubKey = async () => {
  console.log("KMS.showAddress")
  try {
    // TODO: do implementation
    console.error("Not implemented")

    // show key information
  } finally {

  }
}
const KMS_REST_ENDPOINT = "https://cloudkms.googleapis.com/v1"
const getSigningUrl = (gcpKeyPath) => {
  return `${KMS_REST_ENDPOINT}/${gcpKeyPath}:asymmetricSign`;
}

export const signTransaction = async (message, accessToken, gcpKeyPath) => {
  console.log("KMS.signTransaction")
  const kmsUrl = getSigningUrl(gcpKeyPath)
  let sig = null;
  try {
    const response = await fetch(kmsUrl, {
      method: "POST",
      cache: "no-cache",
      headers: {
        'authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify({
        digest: getDigest(message),
      })
    }).catch(e => {
      console.log('error', e)
    })
    if (response.status === 200) {
      // parse up result and package up sig
      const result = await response.json();
      const kmsSignature = result.signature
      sig = convert(kmsSignature);

      console.log('base64 message', message);
      console.log('sig', sig);

    } else {
      console.error("error signing transaction");
      console.log(`KMS Service returned error ${response.status}, check network status`)
    }
  } finally {
    console.log("done signing")
  }

  // return signed tx
  return sig
};
