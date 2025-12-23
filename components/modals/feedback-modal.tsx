"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!feedback.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedback }),
      })

      if (!response.ok) {
        throw new Error("Failed to send feedback")
      }

      setFeedback("")
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error sending feedback:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to send feedback"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            placeholder="Tell us what you think..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-32 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!feedback.trim() || isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Done 🙏🏻" : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
