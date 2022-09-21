import {
    Text,
    Stack,
    Button,
    HStack,
} from "@chakra-ui/react";
import { useState } from "react";

export const DisplayTransaction = ({ signable, account }) => {
    const [vis, setVis] = useState(false)

    console.log(signable)

    return (
        <Stack width="80%" padding="0.5rem" minHeight={"10rem"}>
            <HStack><Text fontSize="0.75rem">Address:</Text><Text>{signable.addr}</Text></HStack>
            <HStack><Text fontSize="0.75rem">KeyId:</Text><Text>{signable.keyId}</Text></HStack>
            <Button width="100%" size={"sm"} onClick={() => setVis(!vis)}>Show Code here</Button>
            {vis && (
                <Stack overflowY="scroll" borderColor='gray.200' borderWidth="1px">
                    <Text fontSize="0.75rem" width="100%" size="0.5rem">
                        {signable?.cadence}
                    </Text>
                </Stack>
            )}
            {vis && (
                <Stack>
                    <Text fontSize="0.75rem" fontWeight="600">Arguments:</Text>
                    {signable?.args.map(arg => {
                        return (
                            <Stack>
                                <HStack><Text>{arg.type}</Text><Text>{arg.value}</Text></HStack>
                            </Stack>
                        )
                    })}
                </Stack>
            )

            }
        </Stack>
    )
}