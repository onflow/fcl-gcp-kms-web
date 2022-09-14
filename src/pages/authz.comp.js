import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import * as fcl from "@onflow/fcl"
import {signTransaction} from "../kms/KmsDevice.js";
import {getKeyIdForKeyByAccountAddress} from "../flow/accounts.js";
import VirtualDevice from '../components/VirtualDevice';

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
const ADDRESS_MISMATCH_MESSAGE = 
<StyledErrorMesssage>
  The Flow account associated with you google account not match the account that is expected by the transaction.
  <br/><br/>
  Please ensure you are logged into the correct google account. It should be the same account when generating the key needed to sign the transaction.
</StyledErrorMesssage>

export const Authz = ({ network = "local" }) => {
  const [signable, setSignable] = useState("")
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState(null);

  const handleCancel = () => {
    fcl.WalletUtils.close()
  }

  useEffect(() => {
    const unmount = fcl.WalletUtils.onMessageFromFCL("FCL:VIEW:READY:RESPONSE", (data) => {
      const _signable = data.body
      setSignable(_signable)
    })

    fcl.WalletUtils.sendMsgToFCL("FCL:VIEW:READY")

    return unmount
  }, [])

  useEffect(() => {
      (async function getAddress() {
          if (!signable) return;          
          if (!account) return;

          const { address, publicKey } = account;

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

          let signature;

          if (signable.voucher) {
            const findPayloadSigners = (voucher) => {
              // Payload Signers Are: (authorizers + proposer) - payer
              let payload = new Set(voucher.authorizers)
              payload.add(voucher.proposalKey.address)
              payload.delete(voucher.payer)
              return Array.from(payload).map(fcl.withPrefix)
            }
            
            const findEnvelopeSigners = (voucher) => {
              // Envelope Signers Are: (payer)
              let envelope = new Set([voucher.payer])
              return Array.from(envelope).map(fcl.withPrefix)
            }
  
            let payloadSigners = findPayloadSigners(signable.voucher)
            let envelopeSigners = findEnvelopeSigners(signable.voucher)

  
            const isPayloadSigner = payloadSigners.includes(fcl.withPrefix(address))
            const isEnvelopeSigner = envelopeSigners.includes(fcl.withPrefix(address))
  
            if (!isPayloadSigner && !isEnvelopeSigner) {
              setMessage(ADDRESS_MISMATCH_MESSAGE)
              setAccount(null)
              return;
            }

            const message = fcl.WalletUtils.encodeMessageFromSignable(signable, fcl.withPrefix(address)).substring(64)
  
            signature = await signTransaction(message)
          }

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
      })();
  }, [signable, account])

  return (
      <StyledContainer>
        {process.env.REACT_APP_ALERT_MESSAGE && <StyledAlertMessage dangerouslySetInnerHTML={{__html: process.env.REACT_APP_ALERT_MESSAGE}}/>}
        <VirtualDevice account={account} onGetAccount={account => setAccount(account)} handleCancel={handleCancel} />
        <StyledMessageWrapper>{ message && <StyledMessage>{message}</StyledMessage> }</StyledMessageWrapper>
      </StyledContainer>    
  )
}
