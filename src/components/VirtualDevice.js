import React, {useState } from 'react'
import {
  CONNECTING_MESSAGE,
} from "../common/messages.js"
import {
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
import {
  Error,
} from "../common/common.js"
import useScript from 'react-script-hook';
import { KmsAccounts } from './KmsAccounts';
import { HeaderTitle } from './HeaderTitle';
import { setUserData } from '../common/utils.js';

const VirtualDevice = ({ network, account, onGetAccount, handleCancel }) => {
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [gcpKeyPath, setGcpKeyPath] = useState(null);
  const [address, setAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // -- loading google scripts -- //
  const [accessToken, setAccessToken] = useState(null);
  const [loginError, setLoginError] = useState(null)

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const KEY_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
  const DISCOVERY_DOC = "https://docs.googleapis.com/$discovery/rest?version=v1";
  const GOOGLE_API_URL = "https://apis.google.com/js/api.js";
  const GOOGLE_CLIENT_URL = "https://accounts.google.com/gsi/client";

  const noop = () => { };
  function gapiInit() {
    window?.gapi.client.init({
      // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
    })
      .then(function () {  
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
    setMessage("")
    setHasUserStarted(true)
    setIsLoggingIn(true)
    console.log('loaded', GOOGLE_CLIENT_URL)
    try {
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
            setMessage("gcp account found")
          } else {
            setLoginError(`account needs scope ${KEY_SCOPE}`)
          }
          setHasUserStarted(false)
        },
      }).requestAccessToken();
    } catch (e) {
      console.log(e)
      setHasUserStarted(false)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const activateAccount = (account) => {
    setAddress(account.address);
    if (onGetAccount) onGetAccount(account)    
    // save account info to local storage
    const userData = {
      accessToken: accessToken,
      gcpKeyPath: gcpKeyPath,
      account: account,
    };
    setUserData(userData)
  }

  // -- loading google scripts -- //

  return (
    <Stack>
      <HeaderTitle address={address} />
      <Stack margin={"0 2rem"}>
        {!accessToken &&
          <Stack margin={"2rem 0"} spacing={"0.5rem"} alignItems="center">
            <Text>Please login to google using OAuth</Text>
            <Text fontSize={"0.75rem"}>(Make sure popups are not blocked)</Text>
            <Button disabled={isLoggingIn} width="100%" padding={"1rem 2rem"} backgroundColor={"#02D87E"} color={"white"} onClick={() => gGsiSignIn()}>Login</Button>
          </Stack>
        }
        {accessToken && (
          <KmsAccounts network={network} accessToken={accessToken} setActiveAccount={activateAccount} setGcpKeyPath={setGcpKeyPath}/>
        )}
        {
          hasUserStarted && !accessToken && CONNECTING_MESSAGE
        }
        {loginError && <Error>{loginError}</Error>}
        {message && <Text>{message}</Text>}
      </Stack>
    </Stack>
  );
};

export default VirtualDevice;
