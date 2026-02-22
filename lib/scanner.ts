import type { NFTCollection } from "./types"

// Dead NFT collections from the 2021-2022 era (seeded for demo)
const DEMO_COLLECTIONS: NFTCollection[] = [
	{
		id: "lostapes-eth",
		address: "0x1A92f7381B9F03921564a437210bB9396471050C",
		name: "Lost Apes Society",
		symbol: "LAS",
		imageUrl: "https://picsum.photos/seed/lostapes/400/400",
		description:
			"A collection of 5,000 unique apes lost in the Ethereum graveyard. Zero volume for 18 months.",
		totalSupply: 5000,
		floorPrice: 0,
		volume30d: 0,
		volume90d: 0.001,
		lastTransferDays: 547,
		holders: 1200,
		chain: "ethereum",
		standard: "ERC-721",
		deadnessScore: 97,
		traits: {
			Background: ["Blue", "Red", "Cosmic", "Void"],
			Fur: ["Brown", "Golden", "Ghost", "Zombie"],
			Eyes: ["Laser", "Dead", "Glowing"]
		}
	},
	{
		id: "pixelgrave-eth",
		address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE8",
		name: "Pixel Graveyard",
		symbol: "PGYD",
		imageUrl: "https://picsum.photos/seed/pixelgrave/400/400",
		description:
			"8,888 pixel art ghosts haunting the Ethereum blockchain. Last sale: 639 days ago.",
		totalSupply: 8888,
		floorPrice: 0,
		volume30d: 0,
		volume90d: 0,
		lastTransferDays: 639,
		holders: 2100,
		chain: "ethereum",
		standard: "ERC-721",
		deadnessScore: 99,
		traits: {
			Background: ["Haunted", "Cemetery", "Void"],
			Ghost: ["Classic", "Zombie", "Crystal", "Fire"],
			Accessory: ["Chain", "None", "Crown", "Candle"]
		}
	},
	{
		id: "voxeldead-eth",
		address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
		name: "Voxel Dead",
		symbol: "VXLD",
		imageUrl: "https://picsum.photos/seed/voxeldead/400/400",
		description:
			"3D voxel skeletons from the 2022 bull run. Community abandoned. Discord gone. Floor: 0 ETH.",
		totalSupply: 3333,
		floorPrice: 0,
		volume30d: 0,
		volume90d: 0,
		lastTransferDays: 812,
		holders: 890,
		chain: "ethereum",
		standard: "ERC-721",
		deadnessScore: 98,
		traits: {
			Body: ["Bone", "Gold Bone", "Crystal Bone"],
			Head: ["Skull", "Crown Skull", "Flame Skull"],
			Background: ["Dark", "Red Mist", "Blue Void"]
		}
	},
	{
		id: "ethghosts-v2",
		address: "0x3d9819210A31b4961b30EF54bE2aDC4F6Def27B4",
		name: "ETH Ghosts V2",
		symbol: "ETHG",
		imageUrl: "https://picsum.photos/seed/ethghosts/400/400",
		description:
			"The sequel nobody asked for. 10,000 ghosts, zero buyers. Floor 0.00 ETH. Last transfer 14 months ago.",
		totalSupply: 10000,
		floorPrice: 0,
		volume30d: 0,
		volume90d: 0.002,
		lastTransferDays: 420,
		holders: 3400,
		chain: "ethereum",
		standard: "ERC-721",
		deadnessScore: 94,
		traits: {
			Background: ["Graveyard", "Haunted House", "Space"],
			Ghost: ["White", "Purple", "Green", "Red"],
			Hat: ["None", "Top Hat", "Crown", "Witch"]
		}
	},
	{
		id: "runedeads-eth",
		address: "0xAe7ab96520DE3A18E5e111B5EaAb095312D7fE84",
		name: "Rune Deads",
		symbol: "RDEAD",
		imageUrl: "https://picsum.photos/seed/runedeads/400/400",
		description:
			"RPG-themed NFTs with promised utility that never shipped. 420 days of zero volume.",
		totalSupply: 6666,
		floorPrice: 0,
		volume30d: 0,
		volume90d: 0,
		lastTransferDays: 420,
		holders: 1700,
		chain: "ethereum",
		standard: "ERC-721",
		deadnessScore: 96,
		traits: {
			Class: ["Warrior", "Mage", "Rogue", "Necromancer"],
			Rarity: ["Common", "Rare", "Legendary", "Dead"],
			Weapon: ["Sword", "Staff", "Dagger", "Scythe"]
		}
	}
]

function calculateDeadnessScore(collection: Partial<NFTCollection>): number {
	let score = 0

	// Floor price = 0 → +40 points
	if ((collection.floorPrice ?? 0) === 0) score += 40
	else if ((collection.floorPrice ?? 0) < 0.001) score += 20

	// Zero 30d volume → +30 points
	if ((collection.volume30d ?? 0) === 0) score += 30
	else if ((collection.volume30d ?? 0) < 0.01) score += 15

	// Days since last transfer
	const daysSince = collection.lastTransferDays ?? 0
	if (daysSince > 365) score += 30
	else if (daysSince > 180) score += 20
	else if (daysSince > 90) score += 10

	return Math.min(100, score)
}

export async function scanWalletCollections(
	// walletAddress: string
): Promise<NFTCollection[]> {
	// In production: use Alchemy NFT API
	// const response = await fetch(
	//   `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true`
	// )

	// For demo/devnet: return seeded dead collections
	await new Promise((resolve) => setTimeout(resolve, 1500))
	return DEMO_COLLECTIONS.map((c) => ({
		...c,
		deadnessScore: calculateDeadnessScore(c),
	})).sort((a, b) => b.deadnessScore - a.deadnessScore)
}

export async function getCollectionById(
	id: string
): Promise<NFTCollection | null> {
	await new Promise((resolve) => setTimeout(resolve, 300))
	return DEMO_COLLECTIONS.find((c) => c.id === id) ?? null
}

export function getDeadnessLabel(score: number): {
	label: string
	color: string
} {
	if (score >= 95) return { label: "Completely Dead", color: "text-red-400" }
	if (score >= 80) return { label: "Nearly Dead", color: "text-orange-400" }
	if (score >= 60) return { label: "Dying", color: "text-yellow-400" }
	return { label: "Struggling", color: "text-green-400" }
}
