import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const walletAddress = searchParams.get("address")
  const history = searchParams.get("history")
  const tokenId = searchParams.get("tokenId")

  if (history === "true" && walletAddress && tokenId) {
    try {
      console.log("[v0] Fetching sales history for:", walletAddress, tokenId)

      const alchemyUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTSales?contractAddress=${walletAddress}&tokenId=${tokenId}&order=desc&limit=50`

      const response = await fetch(alchemyUrl)
      const data = await response.json()

      console.log("[v0] Sales data from Alchemy:", data)

      if (data.nftSales && data.nftSales.length > 0) {
        const sales = data.nftSales.map((sale: any) => ({
          timestamp: sale.blockTimestamp,
          price: sale.sellerFee?.amount || 0,
          buyer: sale.buyerAddress,
          seller: sale.sellerAddress,
        }))

        return NextResponse.json({ sales })
      }

      return NextResponse.json({ sales: [] })
    } catch (error) {
      console.error("[v0] Error fetching sales history:", error)
      return NextResponse.json({ error: "Failed to fetch sales history" }, { status: 500 })
    }
  }

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  try {
    let allNFTs: any[] = []
    let pageKey: string | undefined = undefined

    do {
      const alchemyUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true&pageSize=100${pageKey ? `&pageKey=${pageKey}` : ""}`

      const response = await fetch(alchemyUrl)
      const data = await response.json()

      if (data.ownedNfts && data.ownedNfts.length > 0) {
        allNFTs = [...allNFTs, ...data.ownedNfts]
      }

      pageKey = data.pageKey
    } while (pageKey)

    return NextResponse.json({ nfts: allNFTs })
  } catch (error) {
    console.error("[v0] Error fetching NFTs:", error)
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 })
  }
}
