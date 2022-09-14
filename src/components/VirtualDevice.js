import React, {useEffect, useState} from 'react'
import * as fcl from "@onflow/fcl"
import semver from "semver"
import FlowLogo from "../images/logo.svg";
import {getAccount, createAccount} from "../flow/accounts";
import {
  getVersion as getVersionOnDevice,
  getAddressAndPublicKey as getAddressAndPublicKeyOnDevice, 
  setAddress as setAddressOnDevice,
  clearAddress as clearAddressOnDevice,
} from "../kms/KmsDevice.js";
import {
  CONNECTING_MESSAGE,
  CONNECTION_ERROR_MESSAGE,
  VERSION_ERROR_MESSAGE
} from "../common/messages.js"
import {
  Button,
  Column,
  Centered,
  Row,
  GoogleKMSTitle,
  GoogleKmsImage,
  Text,
  Error,
  Message,
} from "../common/common.js"
import useScript from 'react-script-hook';
import { KmsAccounts } from './KmsAccounts';

const ViewDebug = ({ clearAddress }) => {
  return (
    <>
      <Text style={{marginTop: "2rem"}}>🛠️ DEBUG:</Text>
      <Button onClick={() => clearAddress()}>Clear Address</Button>
    </>
  );
};

const ConnectionPopupStart = ({ setHasUserStarted, clearAddress, debug }) => {
  return (
    <Centered>
      <Message>Please login to google using OAuth</Message>
      <Button onClick={() => setHasUserStarted()}>OAuth Login</Button>
      {debug && <ViewDebug clearAddress={clearAddress} />}
    </Centered>
  );
};

const ViewGetAddress = ({ setNewAddress, isCreatingAccount, setIsCreatingAccount, setMessage, publicKey }) => {

  const createNewAccount = async () => {
    setIsCreatingAccount(true);
    setMessage("Please wait a few moments. The account creation request is being processed.")
    const address = await createAccount(publicKey);
    setNewAddress(address);
  };

  return (
    <Centered>
      { !isCreatingAccount && <Message>The public key on this device is not yet paired with a Flow account. Click the button below to create a new Flow account for this public key.</Message> }
      { !isCreatingAccount && <Button onClick={() => createNewAccount()}>Create New Account</Button> }
    </Centered>
  );
};

const VirtualDevice = ({ account, onGetAccount, handleCancel, debug }) => {
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [initialConnectingToKms, setInitialConnectingToKms] = useState(false)
  const [address, setAddress] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const setNewAddress = async (address, publicKey) => {
    try {
      setMessage("Please verify the new address on your device.")
      await setAddressOnDevice(address);
      setMessage(null);
    } catch (e) {
      setIsCreatingAccount(false);
      handleCancel();
    }

    setAddress(address);
    onGetAccount({ address, publicKey });
  };

  useEffect(() => {
    if (account === null && address !== null) {
      setHasUserStarted(false)
      setInitialConnectingToKms(false)
      setAddress(null)
      setPublicKey(null)
      setMessage(null)
      setIsCreatingAccount(null)
    }
  }, [account])

  useEffect(() => {
    (async function getAccountFromDevice() {
        if (account) return;
        if (!hasUserStarted) return;
        if (address || publicKey) return;
        
        setInitialConnectingToKms(true)

        try {
          let appVersion = await getVersionOnDevice();

          /*
          if (!(semver.gte(appVersion, process.env.REACT_APP_FLOW_APP_VERSION))) {
            setHasUserStarted(false)
            setInitialConnectingToKms(false)
            setError(VERSION_ERROR_MESSAGE)
            return
          }
          */
          if (error === CONNECTION_ERROR_MESSAGE) {
            setError(null);
          }
        } catch(e) {
          console.error(e)
          setHasUserStarted(false)
          setInitialConnectingToKms(false)
          setError(CONNECTION_ERROR_MESSAGE)
          return
        }
        
        setInitialConnectingToKms(false)

        let existingAddress;
        let existingPublicKey;
        try {
          let { address, publicKey } = await getAddressAndPublicKeyOnDevice();
          existingAddress = address;
          existingPublicKey = publicKey;

          if (error === CONNECTION_ERROR_MESSAGE) {
            setError(null);
          }
        } catch(e) {
          console.error(e)
          setHasUserStarted(false)
          setError(CONNECTION_ERROR_MESSAGE)
          return
        }

        let addressFromHardwareAPI = await getAccount(existingPublicKey);
      
        if (existingAddress && addressFromHardwareAPI && existingAddress !== addressFromHardwareAPI) {
          try {
            setMessage("Change in public key detected. Verify the corresponding address on your device.")
            await setAddressOnDevice(addressFromHardwareAPI);
            existingAddress = addressFromHardwareAPI
            setMessage(null)
          } catch (e) {
            handleCancel()
          }
        }
  
        if (existingAddress && existingAddress === addressFromHardwareAPI) {
          onGetAccount({ address: existingAddress, publicKey: existingPublicKey });
          setAddress(existingAddress);
        }

        if (!existingAddress && addressFromHardwareAPI) {
          try {
            setMessage("Change in stored address detected. Verify the corresponding address on your device.")
            await setAddressOnDevice(addressFromHardwareAPI);
            existingAddress = addressFromHardwareAPI
            setMessage(null)
          } catch (e) {
            handleCancel()
          }
          onGetAccount({ address: addressFromHardwareAPI, publicKey: existingPublicKey });
          setAddress(addressFromHardwareAPI);
        }

        setPublicKey(existingPublicKey);

    })();
  }, [hasUserStarted, address, publicKey, account, onGetAccount]);

  // -- loading google scripts -- //
  const [accessToken, setAccessToken] = useState(null);
  const [loginError, setLoginError] = useState(null)

  //const KEY_LOC_LOCATION = "multisig:kms:location"
  const CLIENT_ID = "769260085272-oif0n1ut40vn6p8ldhvp4c4fdkfm3f4d.apps.googleusercontent.com";
  // new kms wallet client id
  //const CLIENT_ID = "1078314026786-bvbbqgjh148uk1s7e3vu13h6da5lusmf.apps.googleusercontent.com";
  const KEY_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
  const DISCOVERY_DOC = "https://docs.googleapis.com/$discovery/rest?version=v1";
  const GOOGLE_API_URL = "https://apis.google.com/js/api.js";
  const GOOGLE_CLIENT_URL = "https://accounts.google.com/gsi/client";
  
  const noop = () => {};
  function gapiInit() {
    window?.gapi.client.init({
      // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
    })
      .then(function () {  // Load the Calendar API discovery document.
        window?.gapi.client.load(DISCOVERY_DOC);
      });
  }
  const gAPILoaded = () => {
    console.log('loaded', GOOGLE_API_URL);
    if (typeof window !== 'undefined') {
      window?.gapi.load('client', gapiInit)
    }
  }
  useScript({
    src: GOOGLE_CLIENT_URL
    , onload: noop
  });
  useScript({
    src: GOOGLE_API_URL
    , onload: () => gAPILoaded()
  });
  const gGsiSignIn = () => {
    console.log('loaded', GOOGLE_CLIENT_URL)
    window?.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: KEY_SCOPE,
      prompt: 'consent',
      callback: (tokenResponse) => {
        console.log(tokenResponse, tokenResponse?.access_token)
        if (window?.google.accounts.oauth2.hasGrantedAllScopes(tokenResponse,
          KEY_SCOPE)) {
          console.log('user has scope, saving access token')
          setAccessToken(tokenResponse.access_token)
        } else {
          setLoginError(`account needs scope ${KEY_SCOPE}`)
        }
      },
    }).requestAccessToken();
  }


  // -- loading google scripts -- //

  return (
    <Column>
      <Centered>
        <Row><GoogleKmsImage src={FlowLogo} /><GoogleKMSTitle>Google KMS</GoogleKMSTitle></Row>
        <Text>{address && `Address: ${fcl.withPrefix(address)}`}</Text>
      </Centered>
      <Centered>
        {
          !hasUserStarted && 
            <ConnectionPopupStart 
              setHasUserStarted={() => gGsiSignIn()} 
              clearAddress={() => clearAddressOnDevice()}
              debug={debug} />
        }
        {accessToken && (
          <KmsAccounts accessToken={accessToken} />
        )}
        {
          hasUserStarted && publicKey && !address && 
            <ViewGetAddress isCreatingAccount={isCreatingAccount} setIsCreatingAccount={setIsCreatingAccount} setNewAddress={(address) => setNewAddress(address, publicKey)} setMessage={setMessage} publicKey={publicKey} />
        }
        {
          hasUserStarted && !initialConnectingToKms && !address && !publicKey &&
            <Text>Retrieving Your Flow Account</Text>
        }
        {
          hasUserStarted && initialConnectingToKms && !address && CONNECTING_MESSAGE
        }
        { error && <Error>{error}</Error> }
        { message && <Text>{message}</Text> }
      </Centered>
    </Column>
  );
};

export default VirtualDevice;
