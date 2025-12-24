import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const contractAddress = searchParams.get("contractAddress")

  if (!contractAddress) {
    return NextResponse.json({ error: "Contract address required" }, { status: 400 })
  }

  try {
    const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60

    const url = `/api/flow-price-history?contractAddress=${contractAddress}&startTimestamp=${oneYearAgo}&limit=500`

    console.log("[v0] Fetching price history from Flow Price History API:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Flow Price History API error:", response.status, response.statusText)
      return NextResponse.json({ events: [] })
    }

    const data = await response.json()
    console.log("[v0] Flow Price History response:", data)

    if (!data.events || !Array.isArray(data.events)) {
      return NextResponse.json({ events: [] })
    }

    // Group events by day and calculate average price
    const pricesByDay = new Map<string, number[]>()

    for (const event of data.events) {
      if (event.floorAsk?.price?.amount?.native) {
        const date = new Date(event.createdAt).toISOString().split("T")[0]
        const price = Number.parseFloat(event.floorAsk.price.amount.native)

        if (!pricesByDay.has(date)) {
          pricesByDay.set(date, [])
        }
        pricesByDay.get(date)!.push(price)
      }
    }

    // Calculate average price per day
    const chartData = Array.from(pricesByDay.entries())
      .map(([date, prices]) => ({
        date,
        price: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    console.log("[v0] Chart data processed:", chartData.length, "points")

    return NextResponse.json({ events: chartData })
  } catch (error) {
    console.error("[v0] Error fetching price history:", error)
    return NextResponse.json({ events: [] })
  }
}
