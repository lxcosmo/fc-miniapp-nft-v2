"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useContext } from "react"
import { AboutModal } from "./modals/about-modal"
import { WhatsNewModal } from "./modals/whats-new-modal"
import { DonateModal } from "./modals/donate-modal"
import { Menu } from "lucide-react"
import { FarcasterContext } from "@/app/providers"

export function MenuDropdown() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [whatsNewOpen, setWhatsNewOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const { sdk } = useContext(FarcasterContext)

  const handleCastFeedback = async () => {
    if (!sdk) return

    const appUrl = "https://fk-nft.vercel.app"
    const text = `${appUrl}\n\nFeedback from NFT Wallet app`

    try {
      await sdk.actions.composeCast({
        text,
        mentions: [],
      })
    } catch (error) {
      console.error("[v0] Error opening cast composer:", error)
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
        <DropdownMenuContent align="end" className="w-48 py-3">
          <DropdownMenuItem onClick={() => setAboutOpen(true)} className="py-3">
            About
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCastFeedback} className="py-3">
            Cast Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AboutModal
        open={aboutOpen}
        onOpenChange={setAboutOpen}
        onDonateClick={() => {
          setAboutOpen(false)
          setDonateOpen(true)
        }}
        onWhatsNewClick={() => {
          setAboutOpen(false)
          setWhatsNewOpen(true)
        }}
      />
      <WhatsNewModal open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />
      <DonateModal open={donateOpen} onOpenChange={setDonateOpen} />
    </>
  )
}

export { MenuDropdown as Menu }
