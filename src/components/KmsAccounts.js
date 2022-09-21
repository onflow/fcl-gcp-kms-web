import { useEffect, useState } from "react";
import { convertPublicKey, getUserData } from "../common/utils";
import {
    Text,
    Stack,
    VStack,
    Input,
    Button,
    Center,
    CircularProgress
} from "@chakra-ui/react";
import { Account } from "./Account";
const CONTENT_KMS_REST_ENDPOINT = "https://content-cloudkms.googleapis.com/v1"
const PUBLIC_KEY_SERVICE = process.env.REACT_APP_MAINNET_KEY_INDEXER_SERVICE;

export const KmsAccounts = ({ accessToken, setActiveAccount, setGcpKeyPath }) => {
    const [keyPath, setKeyPath] = useState(getUserData()?.gcpKeyPath)
    const [publicKeyError, setPublicKeyError] = useState(null);
    const [flowPublicKey, setFlowPublicKey] = useState(null);
    const [accounts, setAccounts] = useState(null)
    const [loading, setLoading] = useState(true);

    const getPublicKeyUrl = () => {
        return `${CONTENT_KMS_REST_ENDPOINT}/${keyPath}/publicKey`;
    }

    const lookup = async (publicKey) => {
        const url = `${PUBLIC_KEY_SERVICE}/key/${publicKey}`;
        const payload = await fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: 'follow',
        }).catch(e => {
            console.log('fetch key accounts error', e)
            setLoading(false)
        });
        console.log(url)
        if (payload && payload.ok) {
            const pk = await payload.json();
            console.log(pk.accounts);
            setAccounts(pk.accounts)
            setLoading(false)
        } else {
            console.log("Could not get accounts from key indexer")
            setPublicKeyError("Could not load accounts")
        }

    }

    const getPublicKey = async () => {
        setLoading(true)
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
            setLoading(false)
        })

        if (response && response.ok) {
            const { pem } = await response.json();
            const pubKey = await convertPublicKey(pem)
            console.log('flow pub key:', pubKey)
            setFlowPublicKey(pubKey);
            lookup(pubKey)
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
        if (accessToken) getPublicKey()
    }, [accessToken])

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
                {loading && (
                    <Center>
                        <VStack>
                            <Text>Retreiving Accounts</Text>
                            <CircularProgress margin="2rem" size="3rem" isIndeterminate color="green.300" />
                        </VStack>
                    </Center>
                )}
                {publicKeyError && <Text margin={"1rem 0"} color={"red"}>{publicKeyError}</Text>}
            </Stack>
            {flowPublicKey && !loading && (
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