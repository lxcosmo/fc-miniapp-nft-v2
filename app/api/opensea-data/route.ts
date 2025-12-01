import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contract = searchParams.get("contract")
  const tokenId = searchParams.get("tokenId")
  const collectionSlug = searchParams.get("collectionSlug")

  if (!contract || !tokenId) {
    return NextResponse.json({ error: "Missing contract or tokenId" }, { status: 400 })
  }

  const apiKey = process.env.OPENSEA_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "OpenSea API key not configured" }, { status: 500 })
  }

  try {
    let collectionFloor = null
    let topOffer = null

    if (collectionSlug) {
      const statsResponse = await fetch(`https://api.opensea.io/api/v2/collections/${collectionSlug}/stats`, {
        headers: {
          "X-API-KEY": apiKey,
        },
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        collectionFloor = statsData.total?.floor_price || null
      }
    }

    if (collectionSlug) {
      const offerResponse = await fetch(
        `https://api.opensea.io/api/v2/offers/collection/${collectionSlug}/nfts/${tokenId}/best`,
        {
          headers: {
            "X-API-KEY": apiKey,
          },
        },
      )

      if (offerResponse.ok) {
        const offerData = await offerResponse.json()
        topOffer = offerData.price?.value || null
      }
    }

    return NextResponse.json({
      collectionFloor,
      topOffer,
    })
  } catch (error) {
    console.error("[v0] Error fetching OpenSea data:", error)
    return NextResponse.json({ error: "Failed to fetch OpenSea data" }, { status: 500 })
  }
}
