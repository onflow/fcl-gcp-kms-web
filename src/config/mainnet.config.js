import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function MainnetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://rest-mainnet.onflow.org")
  }, [])
  return null
}
