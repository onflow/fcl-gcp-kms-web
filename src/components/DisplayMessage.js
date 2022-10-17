import {
    Text,
    Stack,
} from "@chakra-ui/react";

export const DisplayMessage = ({ message }) => {
    console.log(message)
    return (
        <Stack width="80%" padding="0.5rem" minHeight={"10rem"}>
            <Stack overflowY="scroll" borderColor='gray.200' borderWidth="1px">
                <Text fontSize="0.75rem" width="100%" size="0.5rem">
                    {message}
                </Text>
            </Stack>
        </Stack>
    )
}