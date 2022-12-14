import { useEffect, useState } from "react";
import { convertPublicKey, getUserData } from "../common/utils";
import {
    Text,
    Stack,
    VStack,
    Input,
    Center,
    CircularProgress
} from "@chakra-ui/react";
import { Account } from "./Account";
const CONTENT_KMS_REST_ENDPOINT = "https://content-cloudkms.googleapis.com/v1"
const PUBLIC_KEY_SERVICE = process.env.REACT_APP_MAINNET_KEY_INDEXER_SERVICE;
const PUBLIC_KEY_SERVICE_TESTNET = process.env.REACT_APP_TESTNET_KEY_INDEXER_SERVICE;

export const KmsAccounts = ({ network, accessToken, setActiveAccount, setGcpKeyPath }) => {
    const [keyPath, setKeyPath] = useState(getUserData()?.gcpKeyPath)
    const [publicKeyError, setPublicKeyError] = useState(null);
    const [flowPublicKey, setFlowPublicKey] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState(null);

    const getPublicKeyUrl = () => {
        return `${CONTENT_KMS_REST_ENDPOINT}/${keyPath}/publicKey`;
    }

    const lookup = async (publicKey) => {
        setLoadingMessage("Loading Accounts")
        let keyIndexUrl = PUBLIC_KEY_SERVICE;
        if (network === "testnet") {
            keyIndexUrl = PUBLIC_KEY_SERVICE_TESTNET
        }
        const url = `${keyIndexUrl}/key/${publicKey}`;
        const payload = await fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: 'follow',
        }).catch(e => {
            console.log('fetch key accounts error', e)
        }).finally(() => setLoadingMessage(null));
        console.log(url)
        if (payload && payload.ok) {
            const pk = await payload.json();
            console.log(pk.accounts);
            setAccounts(pk.accounts)
        } else {
            console.log("Could not get accounts from key indexer")
            setPublicKeyError("Could not load accounts")
        }

    }

    const getPublicKey = async () => {
        setLoadingMessage("Loading account public key")
        setPublicKeyError("")
        setGcpKeyPath(keyPath)
        const url = getPublicKeyUrl()
        const response = await fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        }).catch(e => {
            console.log('error', e)
        }).finally(() => setLoadingMessage(null))

        if (response && response.ok) {
            const { pem } = await response.json();
            const pubKey = await convertPublicKey(pem)
            console.log('flow pub key:', pubKey)
            setFlowPublicKey(pubKey);
            if (keyPath) lookup(pubKey)
        } else {
            setPublicKeyError("service responed with", response?.status);
            console.log('service responded with code', response?.status)
        }
    }

    const setUserAccount = (account) => {
        setActiveAccount({
            publicKey: flowPublicKey,
            ...account
        })
    }

    useEffect(() => {
        console.log('keyPath', keyPath)
        if (accessToken && keyPath) getPublicKey()
    }, [accessToken, keyPath])

    return (
        <Stack width={"100%"}>
            <Stack>
                <Text>Full Key Path</Text>
                <Input
                    size="sm"
                    width={"100%"}
                    id="full-key-path"
                    placeholder="Full kms key Path"
                    onChange={(e) => setKeyPath(e.target.value)}
                    value={keyPath}
                />
                {loadingMessage && (
                    <Center>
                        <VStack>
                            <Text>{loadingMessage}</Text>
                            <CircularProgress margin="2rem" size="3rem" isIndeterminate color="green.300" />
                        </VStack>
                    </Center>
                )}
                {publicKeyError && <Text margin={"1rem 0"} color={"red"}>{publicKeyError}</Text>}
            </Stack>
            {flowPublicKey && !loadingMessage && (
                <Stack overflowY={"scroll"} height="15rem">
                    {accounts && accounts.length === 0 && (
                        <Text>No accounts found</Text>
                    )}
                    {accounts && accounts.map((account) => {
                        return (
                            <Account account={account} setAccount={() => setUserAccount(account)} />
                        )
                    })}
                </Stack>
            )}
        </Stack>
    )
}