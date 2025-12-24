"use client"

import { useState, useEffect } from "react"

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState(2500)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
        const data = await response.json()
        const price = data.ethereum?.usd || 2500
        setEthPrice(price)
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Error fetching ETH price:", error)
        setIsLoading(false)
      }
    }

    // Fetch immediately
    fetchEthPrice()

    // Update every minute
    const interval = setInterval(fetchEthPrice, 60000)

    return () => clearInterval(interval)
  }, [])

  return { ethPrice, isLoading }
}
