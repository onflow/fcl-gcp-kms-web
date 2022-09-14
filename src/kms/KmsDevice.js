
const SCHEME = 0x301;


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
    // todo get real info
    return {
        address: "0x4cfab7e565eb93e1",
        publicKey: "02d6ff8797f6db9ae07b28d9779be3bb17fd31df2de86780cdf707c2cf9221eae3fcdb31d03b9dcba67ae2fed6839be9542e511a36f4c620a5ac8e2ea5ce014d",
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

export const signTransaction = async (tx) => {
    console.log("KMS.signTransaction")

   try {
    //todo send tx to kms for signing
    } finally {
        
    }

    // return signed tx
    return ""
};

// remove leading byte from public key
const convertToRawPublicKey = (publicKey) => publicKey.slice(1).toString("hex");

// remove 65th byte from signature
const convertToRawSignature = (signature) => signature.slice(0, -1).toString("hex");
