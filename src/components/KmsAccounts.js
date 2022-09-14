import { useState } from "react";
import { StyledContainer } from "../common/common";
import { convertPublicKey } from "../common/utils";
import {
    Text,
    Stack,
    Input,
    Button,
    FormLabel,
    HStack,
    CircularProgress
} from "@chakra-ui/react";
const CONTENT_KMS_REST_ENDPOINT = "https://content-cloudkms.googleapis.com/v1"

export const KmsAccounts = ({ accessToken, setActiveAccount }) => {
    const [keyPath, setKeyPath] = useState(null)
    const [publicKeyError, setPublicKeyError] = useState(null);
    const [flowPublicKey, setFlowPublicKey] = useState(null);
    const [accounts, setAccounts] = useState([])

    const getPublicKeyUrl = () => {
        return `${CONTENT_KMS_REST_ENDPOINT}/${keyPath}/publicKey`;
    }

    const lookup = async (publicKey) => {

    }

    const getPublicKey = async () => {
        setPublicKeyError("")
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
            setPublicKeyError(e);
        })
        if (response?.status === 200) {
            const { pem } = await response.json();
            console.log('result', pem)
            const pubKey = await convertPublicKey(pem)
            setFlowPublicKey(pubKey);
        } else {
            setPublicKeyError("service responed with", response?.status);
            console.log('service responded with code', response?.status)
        }
    }

    return (
        <StyledContainer>
            <Stack>
                <FormLabel>Full Key Path</FormLabel>
                {publicKeyError && <Text color={"red"}>{publicKeyError}</Text>}
                <HStack>
                    <Button size={"sm"} disabled={!accessToken} onClick={() => getPublicKey()}>Lookup Accounts</Button>
                    {keyPath === null && <CircularProgress size={"2rem"} isIndeterminate color="green.300" />}
                    <Input
                        size="sm"
                        id="full-key-path"
                        placeholder="Full kms key Path"
                        onChange={(e) => setKeyPath(e.target.value)}
                        value={keyPath}
                    />
                </HStack>
            </Stack>
            {flowPublicKey && (
                <Stack>
                    {accounts.map(({ address, keyId, weight }) => {
                        return (
                            <>
                                <Text>{address}</Text>
                                <Text>{keyId}</Text>
                                <Text>{weight}</Text>
                            </>)
                    })}
                </Stack>
            )}
        </StyledContainer>
    )
}