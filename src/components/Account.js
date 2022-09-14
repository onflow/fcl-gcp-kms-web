import React, { useEffect, useState } from 'react';
import * as fcl from "@onflow/fcl";

export const Account = ({ address }) => {
    const [account, setAccount] = useState(null);
    // get account information, balance, keyIds
    const populateAccount = async () => {
        const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
        setAccount(account);
    }

    useEffect(() => {
        if (address) populateAccount()
    }, [])

    return account

}