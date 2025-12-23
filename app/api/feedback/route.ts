import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Send DM via Neynar Direct Casts API
    const neynarApiKey = process.env.NEYNAR_API_KEY
    const targetFid = 3858 // @partakon's FID - you can update this

    if (!neynarApiKey) {
      console.warn("[v0] NEYNAR_API_KEY not configured")
      return NextResponse.json({ success: true, warning: "API not configured" })
    }

    try {
      const dmResponse = await fetch("https://api.neynar.com/v2/farcaster/dm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": neynarApiKey,
        },
        body: JSON.stringify({
          recipientFid: targetFid,
          message: `NFT Wallet Feedback: ${message}`,
        }),
      })

      if (!dmResponse.ok) {
        console.error("[v0] Neynar DM failed:", dmResponse.statusText)
      }
    } catch (neynarError) {
      console.error("[v0] Error sending DM via Neynar:", neynarError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 })
  }
}
