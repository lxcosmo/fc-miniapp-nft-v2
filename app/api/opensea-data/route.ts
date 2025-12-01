import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contract = searchParams.get("contract")

  console.log("[v0] API route called with contract:", contract)

  if (!contract) {
    console.log("[v0] Missing contract parameter")
    return NextResponse.json({ error: "Missing contract address" }, { status: 400 })
  }

  try {
    const reservoirUrl = `https://api-base.reservoir.tools/collections/v7?id=${contract}`
    console.log("[v0] Fetching collection data from Reservoir:", reservoirUrl)

    const response = await fetch(reservoirUrl, {
      headers: {
        Accept: "application/json",
      },
    })

    console.log("[v0] Reservoir response status:", response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error("[v0] Reservoir error:", response.status, text)
      return NextResponse.json({ error: "Reservoir API error", status: response.status }, { status: 500 })
    }

    const data = await response.json()
    console.log("[v0] Full Reservoir response:", JSON.stringify(data, null, 2))

    const collection = data.collections?.[0]

    if (!collection) {
      console.log("[v0] No collection found in response")
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    console.log("[v0] Collection object:", JSON.stringify(collection, null, 2))

    const floor = collection.floorAsk?.price?.amount?.native
    const topOffer = collection.topBid?.price?.amount?.native
    const description = collection.description
    const supply = collection.tokenCount

    console.log("[v0] Extracted data - Floor:", floor, "Top Offer:", topOffer, "Supply:", supply)

    return NextResponse.json({
      collectionFloor: floor ?? null,
      topOffer: topOffer ?? null,
      description: description ?? null,
      supply: supply ?? null,
    })
  } catch (error) {
    console.error("[v0] Error fetching Reservoir data:", error)
    return NextResponse.json({ error: "Failed to fetch collection data" }, { status: 500 })
  }
}
