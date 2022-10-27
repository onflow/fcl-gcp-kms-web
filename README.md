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

This wallet depends on the public key indexer service, which is used to look up all accounts with the user's gcp kms public key. 

## Environmental Variables
REACT_APP_MAINNET_KEY_INDEXER_SERVICE=https://key-indexer.production.flow.com
REACT_APP_TESTNET_KEY_INDEXER_SERVICE=https://key-indexer.staging.flow.com