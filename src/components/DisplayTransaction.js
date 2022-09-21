import {
    Text,
    Stack,
    Button,
} from "@chakra-ui/react";
import { useState } from "react";

export const DisplayTransaction = ({ signable, account }) => {
    const [vis, setVis] = useState(false)
    return (
        <Stack justifyContent={"center"} alignContent={"center"} minHeight={"10rem"}>
            <Text>Show Code here</Text>
            <Text>Show Arguments here</Text>
        </Stack>
    )
}