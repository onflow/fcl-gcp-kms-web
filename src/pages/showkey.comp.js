import React, {useState} from 'react'
import styled from 'styled-components'
import semver from "semver"
import FlowLogo from "../images/logo.svg";
import {showAddressAndPubKey, getVersion} from "../kms/KmsDevice.js";
import {
  INITIAL_PK_MESSAGE,
  VIEW_PK_MESSAGE,
  CONNECTING_MESSAGE,
  CONNECTION_ERROR_MESSAGE,
  VERSION_ERROR_MESSAGE
} from "../common/messages.js"
import {
  Button,
  Centered,
  Row,
  GoogleKMSTitle,
  GoogleKmsImage,
  Text,
  Error,
} from "../common/common.js"

const StyledContainer = styled.div`
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const ShowKey = () => {
  const [message, setMessage] = useState(INITIAL_PK_MESSAGE);
  const [error, setError] = useState(null);

  const handleButtonClick = async () => {
    setMessage(CONNECTING_MESSAGE)
    setError(null)

    try {
      let appVersion = await getVersion();

      if (!(semver.gte(appVersion, process.env.REACT_APP_FLOW_APP_VERSION))) {
        setError(VERSION_ERROR_MESSAGE)
        return
      }

      if (error === CONNECTION_ERROR_MESSAGE) {
        setError(null);
      }
    } catch(e) {
      console.error(e)
      setError(CONNECTION_ERROR_MESSAGE)
      return
    }

    try {
      setMessage(VIEW_PK_MESSAGE)
      await showAddressAndPubKey()
    } catch(e) {
      console.error(e)
      setMessage(INITIAL_PK_MESSAGE)
      return
    }
  }

  return (
      <StyledContainer>
        <Centered>
            <Row><GoogleKmsImage src={FlowLogo} /><GoogleKMSTitle>Google KMS</GoogleKMSTitle></Row>
            { error && <Error>{ error }</Error> }
            { message && !error && <Text>{ message }</Text>}
        </Centered>
        <Centered>
            <Button onClick={handleButtonClick}>Show Public Key</Button>
        </Centered>
      </StyledContainer>    
  )
}
