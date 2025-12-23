"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AboutModal } from "./modals/about-modal"
import { Menu } from "lucide-react"
import { useFarcaster } from "@/app/providers"

export function MenuDropdown() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const { sdk } = useFarcaster()

  const handleCastFeedback = async () => {
    if (sdk?.actions?.composeCast) {
      try {
        await sdk.actions.composeCast({
          text: "Check out this awesome NFT wallet app! 🎨\nhttps://nft-awallet.vercel.app",
        })
      } catch (error) {
        console.error("[v0] Error opening composer:", error)
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-transparent px-2">
            <Menu className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setAboutOpen(true)}>About</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCastFeedback}>Cast Feedback</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  )
}

export { MenuDropdown as Menu }
