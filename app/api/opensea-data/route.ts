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
    const url = `https://api.reservoir.tools/collections/v5?id=${encodeURIComponent(contract)}`
    console.log("[v0] Fetching from Reservoir:", url)

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    console.log("[v0] Reservoir response status:", res.status)

    if (!res.ok) {
      const text = await res.text()
      console.error("[v0] Reservoir error:", res.status, text)
      return NextResponse.json({ error: "Reservoir API error", status: res.status }, { status: 500 })
    }

    const json = await res.json()
    console.log("[v0] Reservoir raw response:", JSON.stringify(json, null, 2))

    const collection = json.collections?.[0]

    if (!collection) {
      console.log("[v0] Collection not found in Reservoir")
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const floor = collection.floorAsk?.price?.amount?.native
    const topBid = collection.topBid?.price?.amount?.native

    console.log("[v0] Extracted data - Floor:", floor, "Top Bid:", topBid)

    return NextResponse.json({
      collectionFloor: floor ?? null,
      topOffer: topBid ?? null,
      name: collection.name,
      description: collection.description,
      image: collection.image,
      supply: collection.tokenCount,
      owners: collection.ownerCount,
    })
  } catch (error) {
    console.error("[v0] Error fetching Reservoir data:", error)
    return NextResponse.json({ error: "Failed to fetch collection data" }, { status: 500 })
  }
}
