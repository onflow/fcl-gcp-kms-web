import * as fcl from "@onflow/fcl"
import FlowLogo from "../images/logo.svg";
import {
    Text,
    Stack,
    HStack,
} from "@chakra-ui/react";
import {
    GoogleKMSTitle,
    GoogleKmsImage,
} from "../common/common.js"



export const HeaderTitle = ({ address }) => {


    return (
        <Stack position={"relative"}>
            <HStack><GoogleKmsImage src={FlowLogo} /><GoogleKMSTitle>Google <span>KMS</span></GoogleKMSTitle></HStack>
            <Text position={"absolute"} left="4.75rem" fontWeight={"600"} top="2.5rem" color={"#02D87E"} fontSize={"0.85rem"}>{address && fcl.withPrefix(address)}</Text>
        </Stack>
    )
}