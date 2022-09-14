import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function MainnetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://access-mainnet-beta.onflow.org")
      .put("hardwareWallet.api", process.env.REACT_APP_MAINNET_WALLET_API_HOST || "http://localhost:8081")
  }, [])
  return null
}
