# FCL/gcp kms Wallet 

## Developing locally

### Install

```shell script
yarn install
```

### Start the app

```shell script
yarn run start
```

## Building & publishing

### Emulator

```shell script
# build the React app
yarn run build-emulator

# build the Docker image
docker build -t gcr.io/dl-flow/fcl-gcp-kms-web-emulator .

# publish the Docker image
docker push gcr.io/dl-flow/fcl-gcp-kms-web-emulator
```

### Testnet

```shell script
# build the React app
yarn run build-testnet

# build the Docker image
docker build -t gcr.io/dl-flow/fcl-gcp-kms-web-testnet .

# publish the Docker image
docker push gcr.io/dl-flow/fcl-gcp-kms-web-testnet
```

### Mainnet

```shell script
# build the React app
yarn run build-mainnet

# build the Docker image
docker build -t gcr.io/dl-flow/fcl-gcp-kms-web-mainnet .

# publish the Docker image
docker push gcr.io/dl-flow/fcl-gcp-kms-web-mainnet
```
