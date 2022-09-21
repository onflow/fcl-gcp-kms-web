import {useEffect} from "react"
import {config} from "@onflow/fcl"

const EMULATOR_HOST = process.env.REACT_APP_EMULATOR_HOST || "http://localhost:8080";

export function LocalConfig() {
  useEffect(() => {
    config()
      //.put("accessNode.api", EMULATOR_HOST)
      .put("accessNode.api", "https://rest-mainnet.onflow.org")
      //.put("accessNode.api", "https://rest-testnet.onflow.org")
      .put("hardwareWallet.api", "http://localhost:8081")
  }, [])
  return null
}
