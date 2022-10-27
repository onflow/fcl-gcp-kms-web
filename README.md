*THIS IS ALPHA SOFTWARE, USE AT YOUR OWN RISK*

# FCL gcp kms Wallet
This is a prototype proof of concept wallet to support google key management system (gcp kms) key signing. This repo can be forked and developed using your own google project. 

## Developing locally

### Install

```shell script
yarn
```


## Building & Starting
```shell script
yarn build
yarn start
```

### Mainnet

This is a prototype google oauth / kms wallet
Start the process and configure dapps at it using fcl

```typescript
fcl.config()
.put("challenge.handshake", "http://localhost:3000/mainnet/authn")
```

### Testnet
```typescript
fcl.config()
.put("challenge.handshake", "http://localhost:3000/testnet/authn")
```
`http://localhost:3000` is the endpoint where the service is hosted. The wallet is a react node app an can easily be hosted.
This wallet depends on the public key indexer service, details below. 

## Environmental Variables

### public key indexer
This service looks up accounts that have the user's gcp kms public key
`REACT_APP_MAINNET_KEY_INDEXER_SERVICE`=https://key-indexer.production.flow.com
`REACT_APP_TESTNET_KEY_INDEXER_SERVICE`=https://key-indexer.staging.flow.com

### google project
`REACT_APP_CLIENT_ID`
A client Id is needed for the wallet app. The client id is associated with a google project. This project will need to be created and Oauth enabled. The oauth consent form will be displayed to your users to verify them and allow the user to sign with their gcp kms key. 
