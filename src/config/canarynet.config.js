import {useEffect} from "react"
import {config} from "@onflow/fcl"

export function CanarynetConfig() {
  useEffect(() => {
    config()
      .put("accessNode.api", "https://canary.onflow.org")
  }, [])
  return null
}
