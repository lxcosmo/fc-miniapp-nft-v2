import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // For now, just log it - you can implement actual Farcaster DM sending here
    console.log("[Feedback]", message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 })
  }
}
