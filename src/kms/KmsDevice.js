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

  let address;
  let publicKey;

  try {
    // get kms public key and convert to flow public key

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

export const setAddress = async (address) => {
  console.log("KMS.setAddress")



  try {
    // store the address


  } finally {

  }
};

export const clearAddress = async () => {
  console.log("KMS.clearAddress")


  try {
    // clear the address so user can select another one

  } finally {

  }
};

export const showAddressAndPubKey = async () => {
  console.log("KMS.showAddress")



  try {


    // show key information
  } finally {

  }
}
const KMS_REST_ENDPOINT = "https://cloudkms.googleapis.com/v1"
const getSigningUrl = (gcpKeyPath) => {
  return `${KMS_REST_ENDPOINT}/${gcpKeyPath}:asymmetricSign`;
}

export const signTransaction = async (rlp, accessToken, gcpKeyPath, account) => {
  console.log("KMS.signTransaction")
  const kmsUrl = getSigningUrl(gcpKeyPath)
  let sig = null;
  const message = getPayloadOnly(rlp);
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
      //const env = prepareSignedEnvelope(rlp, keyId, sig);
      //postSignatureToApi(signatureRequestId, env);

      console.log('fcl rlp', rlp);
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

// remove leading byte from public key
const convertToRawPublicKey = (publicKey) => publicKey.slice(1).toString("hex");

// remove 65th byte from signature
const convertToRawSignature = (signature) => signature.slice(0, -1).toString("hex");
