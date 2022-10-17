import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as fcl from "@onflow/fcl"
import { signTransaction } from "../kms/KmsDevice.js";
import { getKeyIdForKeyByAccountAddress } from "../flow/accounts.js";
import VirtualDevice from '../components/VirtualDevice';
import { HeaderTitle } from '../components/HeaderTitle.js';
import { getUserData } from '../common/utils.js';
import { DisplayTransaction } from '../components/DisplayTransaction.js';
import {
    Text,
    Stack,
    Button,
} from "@chakra-ui/react";
const StyledContainer = styled.div`
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledMessageWrapper = styled.div`
  width: 100%;
  font-size: 1rem;
  text-align: center;
`

const StyledMessage = styled.div`
  min-height: 4rem;
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

const StyledErrorMesssage = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  color: white;
  background-color: #FC4C2E;
  box-sizing: border-box;
`

const DEFAULT_MESSAGE = "Please connect to google using OAuth"
export const Sign = ({ network = "local" }) => {
    const [message, setMessage] = useState("");
    const [account, setAccount] = useState(getUserData()?.account);

    const { accessToken, gcpKeyPath } = getUserData();

    const handleCancel = () => {
        fcl.WalletUtils.close()
    }

    useEffect(() => {
        const unmount = fcl.WalletUtils.onMessageFromFCL("FCL:VIEW:READY:RESPONSE", (data) => {
            const msg = data.body
            setMessage(msg)
        })

        fcl.WalletUtils.sendMsgToFCL("FCL:VIEW:READY")

        return unmount
    }, [])


    const doSign = async () => {
        console.log('sign message', message)
        if (!message) return;
        if (!account) return;

        const { address, publicKey } = account;
        console.log('using acct to sign', address)

        if (!publicKey || !address) {
            setMessage(DEFAULT_MESSAGE)
            return
        }
        setMessage("Please follow google OAuth sign in instructions")

        const keyId = await getKeyIdForKeyByAccountAddress(address, publicKey)

        if (keyId === -1) {
            setMessage(DEFAULT_MESSAGE)
            return
        }

        const signature = await signTransaction(message, accessToken, gcpKeyPath, account)
        console.log('signature', signature)


        if (!signature) {
            fcl.WalletUtils.decline("Google KMS did not sign this transaction.")
            setMessage("Please login to your google account using OAuth, follow google login steps.")
            return;
        }

        setMessage("Signature: " + signature)

        fcl.WalletUtils.approve(
            new fcl.WalletUtils.CompositeSignature(
                fcl.withPrefix(address),
                keyId,
                signature
            )
        )
    }

    const setFlowAccount = (account) => {
        // store account
        setAccount(account);
    }

    console.log('selected account', account)
    console.log('signing message')
    return (
        <StyledContainer>
            {process.env.REACT_APP_ALERT_MESSAGE && <StyledAlertMessage dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_ALERT_MESSAGE }} />}
            {!account && <VirtualDevice account={account} onGetAccount={account => setFlowAccount(account)} handleCancel={handleCancel} />}
            {account && (
                <>
                    <Button disabled={!account} width="80%" padding={"1rem 2rem"} backgroundColor={"#02D87E"} color={"white"} onClick={() => doSign()}>Sign Message</Button>
                </>
            )}

        </StyledContainer>
    )
}
