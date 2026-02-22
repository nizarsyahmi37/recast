export interface NFTCollection {
	id: string
	address: string
	name: string
	symbol: string
	imageUrl: string
	description: string
	totalSupply: number
	floorPrice: number // in ETH
	volume30d: number // in ETH
	volume90d: number
	lastTransferDays: number // days since last transfer
	holders: number
	chain: "ethereum"
	standard: "ERC-721" | "ERC-1155"
	deadnessScore: number // 0-100, higher = more dead
	traits?: Record<string, string[]>
}

export interface NFT {
	tokenId: string
	collectionAddress: string
	name: string
	description: string
	imageUrl: string
	attributes: Array<{
		trait_type: string
		value: string
	}>
	owner: string
}

export interface ResurrectionStatus {
	collectionId: string
	status: "idle" | "scanning" | "bridging" | "deploying" | "gallery" | "dao" | "drop" | "complete"
	txHash?: string
	solanaMintAddress?: string
	solanaCollectionId?: string
	daoAddress?: string
	error?: string
}

export interface SolanaCollection {
	id: string
	name: string
	description: string
	imageUrl: string
	mintAddress: string
	totalSupply: number
	royaltyBps: number // basis points, e.g. 500 = 5%
	creator: string
	holders: string[]
	daoAddress?: string
	blink?: string
	createdAt: number
	sourceCollection: string // original ETH address
	sourceChain: "ethereum"
}

export interface LoyaltyEvent {
	type: "migration" | "vote" | "hold" | "blink_share"
	points: number
	timestamp: number
	collectionId: string
}
