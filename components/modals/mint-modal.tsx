"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFarcaster } from "@/app/providers"

interface MintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MintModal({ open, onOpenChange }: MintModalProps) {
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { walletAddress } = useFarcaster()

  const MIN_PRICE = 0.0001

  const handleMint = async () => {
    setError("")

    if (!price) {
      setError("Please enter a price")
      return
    }

    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum < MIN_PRICE) {
      setError(`Minimum price is ${MIN_PRICE} ETH`)
      return
    }

    if (!walletAddress) {
      setError("Wallet not connected")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress: walletAddress,
          price: priceNum.toString(),
          recipientOfPayment: "0xdBB9f76DC289B4cec58BCfe10923084F96Fa6Aee",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to mint NFT")
      }

      setPrice("")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mint NFT</DialogTitle>
          <DialogDescription>Get your unique NFT for future wallet activities</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* NFT Image Placeholder */}
          <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <span className="text-muted-foreground text-sm">NFT Image</span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground">Данная NFT пригодится в будущих активностях кошелька</p>

          {/* Price Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose how much you want to pay</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={`Min: ${MIN_PRICE} ETH`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.0001"
                min={MIN_PRICE}
                disabled={isLoading}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">ETH</span>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-sm text-destructive">{error}</div>}

          {/* Mint Button */}
          <Button onClick={handleMint} disabled={isLoading || !price} className="w-full">
            {isLoading ? "Minting..." : "Mint"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
