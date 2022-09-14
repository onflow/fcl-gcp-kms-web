import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function TestnetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://access-testnet.onflow.org")
      .put("hardwareWallet.api", process.env.REACT_APP_TESTNET_WALLET_API_HOST || "http://localhost:8081")
  }, [])
  return null
}
