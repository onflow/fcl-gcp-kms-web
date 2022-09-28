import React, { useEffect, useState } from 'react';
import * as fcl from "@onflow/fcl";
import {
    Text,
    Stack,
    Button,
    HStack,
    CircularProgress,
    Fade
} from "@chakra-ui/react";

export const Account = ({ account, setAccount }) => {
    const { address, keyId, weight } = account;
    const [balance, setBalance] = useState(null);
    // get account information, balance, keyIds
    const populateAccount = async (addr) => {
        const account = await fcl.send([fcl.getAccount(addr)])
            .then(fcl.decode)
            .catch(e => setBalance("-"));
        const bal = parseInt(account?.balance || 0)
        const amt = (bal / 100000000).toFixed(4);
        setBalance(amt);
    }

    useEffect(() => {
        if (address) populateAccount(address)
    }, [])

    return (
        <Button onClick={() => setAccount(account)} height={"100%"} borderRadius={"0.5rem"} border={"1px"} borderColor={"#E8E8E8"} padding={"0.5rem"} spacing={"0.1rem"} backgroundColor={"#02D87E"}>
            <Stack fontSize={"1rem"} >
                <HStack spacing={"0.75rem"}>
                    <Text>{address}</Text>
                    {!balance && (<CircularProgress size={"1rem"} />)}
                    {balance && (<Fade in={true}><HStack><Text alignContent={"flex-start"} fontSize={"0.75rem"}>{balance}</Text><Text color={"#ffffff"} fontSize={"0.5rem"}>FLOW</Text></HStack></Fade>)}
                </HStack>
                <HStack fontSize={"0.75rem"}>
                    <Text>KeyId:</Text><Text>{keyId}</Text>
                    <Text>Weight:</Text><Text>{weight}</Text>
                </HStack>
            </Stack>
        </Button>
    )

}