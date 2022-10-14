import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import * as fcl from "@onflow/fcl"
import {useLocation} from "react-router-dom"
import {getKeyIdForKeyByAccountAddress} from "../flow/accounts";
import VirtualDevice from '../components/VirtualDevice';

const StyledContainer = styled.div`
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledAlertMessage = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  min-height: 3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  color: white;
  background-color: #FC4C2E;
  box-sizing: border-box;
`

export const Authn = ({ network = "local" }) => {
    const [account, setAccount] = useState(null);
    const [serviceConfig, setServiceConfig] = useState(null)
    const [appConfig, setAppConfig] = useState(null)

    const handleCancel = () => {
      fcl.WalletUtils.close()
    }

    useEffect(() => {
      const unmount = fcl.WalletUtils.onMessageFromFCL("FCL:VIEW:READY:RESPONSE", (data) => {
        setServiceConfig(data.config.services)
        setAppConfig(data.config.app)
      })
  
      fcl.WalletUtils.sendMsgToFCL("FCL:VIEW:READY")

      return unmount
    }, [])

    useEffect(() => {
        (async function getAddress() {
            if (!account) return;

            const { address, publicKey } = account;

            if (!publicKey || !address) {
              return
            }

            const keyId = await getKeyIdForKeyByAccountAddress(address, publicKey)

            fcl.WalletUtils.approve({
              f_type: "AuthnResponse",
              f_vsn: "1.0.0",
              addr: fcl.withPrefix(address),  
              services: [      
                {
                  f_type: "Service",
                  f_vsn: "1.0.0",
                  type: "authz",
                  method: "IFRAME/RPC",
                  uid: "fcl-goog-kms-authz",
                  endpoint: `${window.location.origin}/${network}/authz`,
                  identity: {
                    f_type: "Identity",
                    f_vsn: "1.0.0",
                    address: fcl.withPrefix(address),
                    keyId: keyId,
                  },
                  data: {},
                  params: {}
                },
                {
                  f_type: "Service",
                  f_vsn: "1.0.0",
                  type: "user-signature",
                  method: "IFRAME/RPC",
                  uid: "fcl-goog-kms-authz",
                  endpoint: `${window.location.origin}/${network}/sign`,
                  identity: {
                    f_type: "Identity",
                    f_vsn: "1.0.0",
                    address: fcl.withPrefix(address),
                    keyId: keyId,
                  },
                  data: {},
                  params: {}
                },
                {
                  f_type: "Service",
                  f_vsn: "1.0.0",
                  type: "authn",
                  method: "DATA",
                  uid: "fcl-goog-kms-authn",
                  endpoint: `${window.location.origin}/${network}/authn`,
                  id: fcl.withPrefix(address),
                  identity: {
                    f_type: "Identity",
                    f_vsn: "1.0.0",
                    address: fcl.withPrefix(address),
                    keyId: keyId,
                  },
                  provider: {
                    f_type: "ServiceProvider",                
                    f_vsn: "1.0.0",                          
                    address: "0xPLACEHOLDER",                
                  },
                },
              ]
            })
        })();
    }, [account])

    return (
        <StyledContainer>
            {process.env.REACT_APP_ALERT_MESSAGE && <StyledAlertMessage dangerouslySetInnerHTML={{__html: process.env.REACT_APP_ALERT_MESSAGE}}/>}
            <VirtualDevice network={network} account={account} onGetAccount={account => setAccount(account)} handleCancel={handleCancel} />
        </StyledContainer>    
    )
}
