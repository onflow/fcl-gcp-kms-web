import {
    Text,
    Stack,
} from "@chakra-ui/react";
import { hexToString } from "../common/utils";;

export const DisplayMessage = ({ message }) => {
    console.log(message)
    return (
        <Stack width="80%" padding="0.5rem" minHeight={"10rem"}>
            <Stack overflowY="scroll" borderColor='gray.200' borderWidth="1px">
                <Text fontSize="0.75rem" minHeight="10rem" width="100%" size="0.5rem">
                    {hexToString(message)}
                </Text>
            </Stack>
        </Stack>
    )
}