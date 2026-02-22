export interface RevivalDrop {
	collectionId: string
	merkleTreeAddress: string
	totalDropped: number
	claimed: boolean
	claimTx?: string
}

const claimsCache: Record<string, RevivalDrop> = {}

export async function createRevivalDrop(
	collectionId: string,
	holderCount: number
): Promise<RevivalDrop> {
	await new Promise((resolve) => setTimeout(resolve, 1500))

	const drop: RevivalDrop = {
		collectionId,
		merkleTreeAddress: `Tree${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
		totalDropped: holderCount,
		claimed: false,
	}

	claimsCache[collectionId] = drop
	return drop
}

export async function claimRevivalDrop(
	collectionId: string,
	// walletAddress: string
): Promise<string> {
	await new Promise((resolve) => setTimeout(resolve, 2000))
	const txHash = `${Math.random().toString(36).substring(2, 20).toUpperCase()}`

	if (claimsCache[collectionId]) {
		claimsCache[collectionId].claimed = true
		claimsCache[collectionId].claimTx = txHash
	}

	return txHash
}

export function getDropStatus(collectionId: string): RevivalDrop | null {
	return claimsCache[collectionId] ?? null
}

// Production: use @metaplex-foundation/mpl-bubblegum
// export async function createCompressedDrop(
// 	umi: Umi,
// 	collectionMint: PublicKey,
// 	holders: PublicKey[]
// ) {
// 	const merkleTree = generateSigner(umi)
// 	await createTree(umi, {
// 		merkleTree,
// 		maxDepth: 14,
// 		maxBufferSize: 64,
// 	}).sendAndConfirm(umi)

// 	for (const holder of holders) {
// 		await mintToCollectionV1(umi, {
// 			merkleTree: merkleTree.publicKey,
// 			collectionMint,
// 			leafOwner: holder,
// 			metadata: { name: "Revival Drop", uri: "...", sellerFeeBasisPoints: 0 },
// 		}).sendAndConfirm(umi)
// 	}
// }
