"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDonateClick: () => void
  onWhatsNewClick: () => void
}

export function AboutModal({ open, onOpenChange, onDonateClick, onWhatsNewClick }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="text-base text-foreground">
            Created by{" "}
            <a
              href="https://warpcast.com/lxc5m"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @lxc5m
            </a>
          </div>
          <div className="text-base text-muted-foreground">Version v1.6</div>
          <button onClick={onWhatsNewClick} className="text-primary hover:underline text-base cursor-pointer">
            What's New
          </button>
          <button onClick={onDonateClick} className="text-primary hover:underline text-base cursor-pointer">
            Donate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
