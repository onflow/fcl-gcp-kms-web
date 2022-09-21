import React from "react"
import {
    TextCenter,
    HorizontalLine,
    Text
} from "./common.js"

export const INITIAL_PK_MESSAGE = "Press the button below to login using OAuth."
export const VIEW_PK_MESSAGE = "View the Public Key displayed from Google KMS key"
export const CONNECTING_MESSAGE = <Text>Connecting to google using OAuth.</Text>
export const CONNECTION_ERROR_MESSAGE = 
<div>
  <TextCenter>Sorry, we couldn't connect to google using OAuth. </TextCenter><br />
  <HorizontalLine /><br />
  We recommend using Google Chrome to connect to google. <br />
  - Make sure you have Network connectivity<br />
  - Make sure you have logged out of any google accounts<br />
</div>
export const VERSION_ERROR_MESSAGE = "Your Flow app is out of date. Please update your Flow app to the latest version using Ledger Live."
