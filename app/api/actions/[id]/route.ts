import { NextRequest, NextResponse } from "next/server"

// Solana Actions spec: https://solana.com/docs/advanced/actions
// OrbitFlare track — Blinks endpoint

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const origin = request.headers.get("origin") ?? ""

	// Collection metadata (in production: fetch from DB)
	const COLLECTION_META: Record<string, {
		name: string
		description: string
		symbol: string
	}> = {
		"lostapes-eth": {
			name: "Lost Apes Society",
			description: "5,000 apes resurrected on Solana. Claim your free revival NFT.",
			symbol: "LAS"
		},
		"pixelgrave-eth": {
			name: "Pixel Graveyard",
			description: "8,888 pixel ghosts back from the dead. Free revival NFT for all original holders.",
			symbol: "PGYD"
		},
		"voxeldead-eth": {
			name: "Voxel Dead",
			description: "3,333 voxel skeletons reborn on Solana. Claim your free compressed NFT.",
			symbol: "VXLD"
		},
		"ethghosts-v2": {
			name: "ETH Ghosts V2",
			description: "10,000 ghosts returned from the Ethereum graveyard. Free revival drop.",
			symbol: "ETHG"
		},
		"runedeads-eth": {
			name: "Rune Deads",
			description: "6,666 RPG NFTs with real utility this time. Claim your revival NFT.",
			symbol: "RDEAD"
		}
	}

	const meta = COLLECTION_META[id] ?? {
		name: "RECAST Collection",
		description: "A resurrected NFT collection. Claim your free revival NFT.",
		symbol: "RCST"
	}

	// Solana Actions GET response
	const actionGet = {
		icon: `${origin || "https://recast.vercel.app"}/icon.png`,
		label: `Claim ${meta.symbol} Revival NFT`,
		title: `${meta.name} — Resurrected on Solana`,
		description: meta.description,
		links: {
			actions: [
				{
					label: "Claim Free Revival NFT",
					href: `/api/actions/${id}?action=claim`,
					type: "transaction"
				},
				{
					label: "Join Collection DAO",
					href: `/api/actions/${id}?action=dao`,
					type: "external-link",
					externalLink: {
						interstitial: "sponsored",
						href: `/collection/${id}?tab=dao`
					}
				},
				{
					label: "View Gallery",
					href: `/collection/${id}`,
					type: "external-link",
					externalLink: {
						interstitial: "none",
						href: `/collection/${id}`
					}
				}
			]
		}
	}

	return NextResponse.json(actionGet, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, x-action-version, x-blockchain-ids",
			"X-Action-Version": "2.4",
			"X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
		}
	})
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const body = await request.json()
	const { account, action } = body

	if (action === "dao") {
		return NextResponse.json({
			type: "external-link",
			externalLink: `/collection/${id}?tab=dao`
		}, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"X-Action-Version": "2.4",
				"X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
			}
		})
	}

	// Return a mock transaction for claim action
	// Production: build a real Solana transaction that mints the cNFT to the user
	const mockTransaction = {
		transaction: Buffer.from(
			JSON.stringify({
				message: `Mock transaction: mint cNFT from ${id} to ${account}`,
				instructions: [],
				feePayer: account
			})
		).toString("base64"),
		message: `Your ${id} revival NFT is being minted!`
	}

	return NextResponse.json(mockTransaction, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"X-Action-Version": "2.4",
			"X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
		}
	})
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, x-action-version, x-blockchain-ids"
		}
	})
}
