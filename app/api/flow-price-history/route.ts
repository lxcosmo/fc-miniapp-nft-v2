import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const contractAddress = searchParams.get("contractAddress")

  if (!contractAddress) {
    return NextResponse.json({ error: "Contract address required" }, { status: 400 })
  }

  try {
    // Get last 90 days of data
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)

    const url = `https://api.reservoir.tools/collections/${contractAddress}/floor-ask/events/v1?startTimestamp=${Math.floor(startDate.getTime() / 1000)}&endTimestamp=${Math.floor(endDate.getTime() / 1000)}&limit=1000`

    console.log("[v0] Fetching daily price history from Reservoir:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Reservoir API error:", response.status, response.statusText)
      return NextResponse.json({ events: [] })
    }

    const data = await response.json()

    if (!data.events || !Array.isArray(data.events)) {
      return NextResponse.json({ events: [] })
    }

    // Group events by day (at 00:00 UTC) and get the price at each day's start
    const pricesByDay = new Map<string, { price: number; timestamp: number }>()

    for (const event of data.events) {
      if (event.floorAsk?.price?.amount?.native) {
        const eventDate = new Date(event.createdAt)
        const dayStart = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate())
        const dateKey = dayStart.toISOString().split("T")[0]
        const price = Number.parseFloat(event.floorAsk.price.amount.native)

        // Keep the first event of each day (closest to 00:00)
        if (!pricesByDay.has(dateKey)) {
          pricesByDay.set(dateKey, {
            price,
            timestamp: dayStart.getTime() / 1000,
          })
        }
      }
    }

    // Convert to sorted array with formatted date
    const chartData = Array.from(pricesByDay.entries())
      .map(([date, data]) => ({
        date,
        price: Number(data.price.toFixed(4)),
        timestamp: data.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    console.log("[v0] Daily price history processed:", chartData.length, "points")

    return NextResponse.json({ events: chartData })
  } catch (error) {
    console.error("[v0] Error fetching daily price history:", error)
    return NextResponse.json({ events: [] })
  }
}
