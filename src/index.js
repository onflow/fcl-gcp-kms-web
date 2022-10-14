import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from "@chakra-ui/react";
import styled, { createGlobalStyle } from "styled-components"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { LocalConfig } from "./config/local.config"
import { CanarynetConfig } from "./config/canarynet.config"
import { TestnetConfig } from "./config/testnet.config"
import { MainnetConfig } from "./config/mainnet.config"
import { FaTimes } from "react-icons/fa"
import { Authn } from "./pages/authn.comp"
import { Authz } from "./pages/authz.comp"
import { ShowKey } from "./pages/showkey.comp"
import { extendTheme } from '@chakra-ui/react'
import { Sign } from './pages/sign.comp';

window.fcl = fcl
window.types = types


const styles = {
  styles: {
    global: (props) => ({
      'html, body': {
        fontSize: 'sm',
        color: props.colorMode === 'dark' ? 'white' : 'gray.600',
        lineHeight: 'tall',
        FontFamily: "Inter,sans-serif"
      },
      a: {
        color: props.colorMode === 'dark' ? 'teal.300' : 'teal.500',
      },
    }),
  },
}
const theme = extendTheme({ styles })

const GlobalStyle = createGlobalStyle`
  * { 
    margin:0;
    padding:0;
    font-variant-ligatures: common-ligatures;
  }
  :root {
    --text-primary: #0F0F0F;
    --text-secondary: #0B0B0B;
    --font-family:"Inter",sans-serif;
  }
  body {
    background-color: transparent;
    color: var(--text-primary);
    font-family: var(--font-family);
    font-size: 16px;
    line-height: 22px;
    padding: 22px;
  }
`

const Wrapper = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Inner = styled.div`
  max-height: 100vh;
  min-height: 20rem;
  width: 30rem;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 1rem;
  background-color: white;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
`

const CloseIcon = styled(FaTimes)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  height: 1.25rem;
  width: auto;
  cursor: pointer;
`

const DEBUG = process.env.REACT_APP_DEBUG || false;

const FourOhFour = () => <div>404</div>

const handleCancel = () => {
  window.parent.postMessage({
    type: "FCL:FRAME:CLOSE"
  }, "*")
}

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Wrapper onClick={handleCancel}>
          <Inner onClick={e => e.stopPropagation()}>
            <Switch>
              <Route path="/showkey" component={ShowKey} exact />
              <div>
                <CloseIcon onClick={handleCancel} />
                <Route path="/local" component={LocalConfig} />
                <Route path="/canarynet" component={CanarynetConfig} />
                <Route path="/testnet" component={TestnetConfig} />
                <Route path="/mainnet" component={MainnetConfig} />
                <Switch>
                  <Route path="/local/authn" component={props => <Authn {...props} network="local" debug={DEBUG} />} exact />
                  <Route path="/canarynet/authn" component={props => <Authn {...props} network="canarynet" debug={DEBUG} />} exact />
                  <Route path="/testnet/authn" component={props => <Authn {...props} network="testnet" debug={DEBUG} />} exact />
                  <Route path="/mainnet/authn" component={props => <Authn {...props} network="mainnet" debug={DEBUG} />} exact />
                  <Route path="/local/authz" component={props => <Authz {...props} network="local" debug={DEBUG} />} exact />
                  <Route path="/canarynet/authz" component={props => <Authz {...props} network="canarynet" debug={DEBUG} />} exact />
                  <Route path="/testnet/authz" component={props => <Authz {...props} network="testnet" debug={DEBUG} />} exact />
                  <Route path="/mainnet/authz" component={props => <Authz {...props} network="mainnet" debug={DEBUG} />} exact />
                  <Route path="/testnet/sign" component={props => <Sign {...props} network="testnet" debug={DEBUG} />} exact />
                  <Route path="/mainnet/sign" component={props => <Sign {...props} network="mainnet" debug={DEBUG} />} exact />
                  <Route component={FourOhFour} />
                </Switch>
              </div>
            </Switch>
          </Inner>
        </Wrapper>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
