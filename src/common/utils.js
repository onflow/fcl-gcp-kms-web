import Keypairs from "@root/keypairs"
import { Buffer } from 'buffer';
import * as crypto from "crypto-browserify";
import { decode, encode } from "rlp";
import { fromBER } from "asn1js"
import keyutils from 'js-crypto-key-utils';

const leftPaddedHexBuffer = (value, pad) => {
    let result = Buffer.from(value, "base64");
    if (value.length < 32) {
        console.log('lenght too short, left padding value')
        result = Buffer.from(value.padStart(pad * 2, 0), "hex");
    }
    return result;
}

const rightPaddedHexBuffer = (value, pad) =>
    Buffer.from(value.padEnd(pad * 2, 0), "hex");


export const convertPublicKey = async (kmsPublicKey) => {
    //const jwk = await Keypairs.import({ pem: kmsPublicKey });
    const keyObjFromPem = new keyutils.Key('pem', kmsPublicKey);
    const jwk = await keyObjFromPem.export('jwk');
    
    const xValue = leftPaddedHexBuffer(jwk.x, 32);
    const yValue = leftPaddedHexBuffer(jwk.y, 32);
    const key = Buffer.concat([xValue, yValue]).toString("hex");
    return key;
}


export const getDigest = (message) => {
    const hash = crypto.createHash("sha256")
    hash.update(Buffer.from(message, "hex"))
    const digest = hash.digest();
    return {
        sha256: digest.toString("base64")
    }
}

export const TRANSACTION_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FLOW-V0.0-transaction").toString("hex"),
    32
).toString("hex");

export const getPayloadOnly = (message) => {
    const decodePayload = decode("0x" + message)[0]
    const payload = TRANSACTION_DOMAIN_TAG + encode([decodePayload, []]).toString("hex");
    const b64 = payload.toString("base64");
    return b64
}

export const convertTxToGcpPayload = (message) => {
    const b64 = message.toString("base64");
    return b64
}

function padArrayWithZero(byteArray, size) {
    if (byteArray.length < size) {
        const lacking = new Array(size - byteArray.length).fill(0);
        return lacking.concat(byteArray);
    }
    return byteArray
}

const getHex = (value) => {
    const arrBuffer = padArrayWithZero(value.valueBlock.valueHex, 32);
    const buf = Buffer.from(arrBuffer, "hex");
    return buf.slice(Math.max(buf.length - 32, 0))
}

const toArrayBuffer = (buffer) => {
    const ab = new ArrayBuffer(buffer.length)
    const view = new Uint8Array(ab)
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i]
    }
    return ab
}

const parseSignature = (buf) => {
    const { result } = fromBER(toArrayBuffer(buf))
    const values = (result).valueBlock.value
    const r = getHex(values[0])
    const s = getHex(values[1])
    return { r, s }
}

export const convert = (kmsSignature) => {
    const sig = Buffer.from(kmsSignature, "base64");

    // Convert the binary signature output to to format Flow network expects
    const { r, s } = parseSignature(sig)
    return Buffer.concat([r, s]).toString("hex")
}

export const prepareSignedEnvelope = (rlp, keyId, signature) => {
    const decodePayload = decode("0x" + rlp)[0];
    const env = encode([decodePayload, [], [[0, parseInt(keyId), Buffer.from(signature, "hex")]]]).toString("hex");
    return env;
}

const KEY_LOC_LOCATION = "gcp-wallet:kms:location"

export const getUserData = () => {
    let userData = {}
    if (typeof window !== "undefined") {
        userData = JSON.parse(window?.localStorage.getItem(KEY_LOC_LOCATION))
    } else {
        console.error("window.localStorage not found")
    }
    return userData;
}

export const setUserData = (userData) => {
    if (typeof window !== "undefined") {
        window?.localStorage.setItem(KEY_LOC_LOCATION, JSON.stringify(userData));
    } else {
        console.error("window.localStorage not found")
    }
}