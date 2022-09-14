import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function CanarynetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://canary.onflow.org")
      .put("hardwareWallet.api", process.env.REACT_APP_CANARYNET_WALLET_API_HOST || "http://localhost:8081")
  }, [])
  return null
}
