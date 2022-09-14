import Keypairs from "@root/keypairs"

const leftPaddedHexBuffer = (value, pad) => {
    let result = Buffer.from(value, "base64");
    if (value.length < 32) {
        console.log('lenght too short, left padding value')
        result = Buffer.from(value.padStart(pad * 2, 0), "hex");
    }
    return result;
}

export const convertPublicKey = async (kmsPublicKey) => {
    const jwk = await Keypairs.import({ pem: kmsPublicKey });
    const xValue = leftPaddedHexBuffer(jwk.x, 32);
    const yValue = leftPaddedHexBuffer(jwk.y, 32);
    const key = Buffer.concat([xValue, yValue]).toString("hex");
    return key;
}