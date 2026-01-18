import { NextRequest, NextResponse } from "next/server"

// Webhook handler for Farcaster Mini App events
// Events: frame_added, frame_removed, notifications_enabled, notifications_disabled

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[webhook] Received event:", JSON.stringify(body, null, 2))
    
    const { event } = body
    
    switch (event) {
      case "frame_added":
        // User pinned/added the mini app
        console.log("[webhook] Mini app added/pinned by user")
        break
        
      case "frame_removed":
        // User unpinned/removed the mini app
        console.log("[webhook] Mini app removed/unpinned by user")
        break
        
      case "notifications_enabled":
        // User enabled notifications
        console.log("[webhook] Notifications enabled by user")
        break
        
      case "notifications_disabled":
        // User disabled notifications
        console.log("[webhook] Notifications disabled by user")
        break
        
      default:
        console.log("[webhook] Unknown event type:", event)
    }
    
    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("[webhook] Error processing webhook:", error)
    // Still return 200 to prevent retries for malformed requests
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 200 })
  }
}

// Also handle GET for webhook verification if needed
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" })
}
