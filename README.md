# FCL gcp kms Wallet 

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
.put("challenge.handshake", "http://localhost:3000/local/authn")
```

In the current state, it only supports mainnet. This wallet depends on the key-indexer service, which only supports reverse public key look ups on mainnet. 