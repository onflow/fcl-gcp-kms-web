import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function MainnetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://access-mainnet-beta.onflow.org")
  }, [])
  return null
}
