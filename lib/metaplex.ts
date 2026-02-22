import type { NFTCollection, NFT } from "./types"

// Mock NFT data for a resurrected collection
function generateMockNFTs(collection: NFTCollection, count = 12): NFT[] {
	return Array.from({ length: count }, (_, i) => ({
		tokenId: `${i + 1}`,
		collectionAddress: collection.address,
		name: `${collection.name} #${i + 1}`,
		description: collection.description,
		imageUrl: `https://picsum.photos/seed/${collection.id}${i}/400/400`,
		attributes: Object.entries(collection.traits ?? {}).map(([trait_type, values]) => ({
			trait_type,
			value: values[i % values.length]
		})),
		owner: `0x${Math.random().toString(16).slice(2, 42)}`
	}))
}

// Mock Solana collection data
export interface SolanaCollectionData {
	mintAddress: string
	nfts: NFT[]
	royaltyBps: number
	creator: string
	totalMinted: number
}

const solanaCollectionsCache: Record<string, SolanaCollectionData> = {}

export async function getResurrectedCollection(
	collectionId: string,
	originalCollection: NFTCollection,
	royaltyBps: number
): Promise<SolanaCollectionData> {
	if (solanaCollectionsCache[collectionId]) {
		return solanaCollectionsCache[collectionId]
	}

	const data: SolanaCollectionData = {
		mintAddress: `So1ana${collectionId.slice(0, 8).toUpperCase()}`,
		nfts: generateMockNFTs(originalCollection, 12),
		royaltyBps,
		creator: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
		totalMinted: originalCollection.totalSupply,
	}

	solanaCollectionsCache[collectionId] = data
	return data
}

// Production: use @metaplex-foundation/mpl-core
// export async function deployCollection(
// 	umi: Umi,
// 	name: string,
// 	uri: string,
// 	royaltyBps: number
// ) {
// 	const collectionSigner = generateSigner(umi)
// 	await createCollectionV1(umi, {
// 		collection: collectionSigner,
// 		name,
// 		uri,
// 		plugins: [
// 			{
// 				type: "Royalties",
// 				basisPoints: royaltyBps,
// 				creators: [{ address: umi.identity.publicKey, percentage: 100 }],
// 				ruleSet: ruleSet("None"),
// 			},
// 		],
// 	}).sendAndConfirm(umi)
// 	return collectionSigner.publicKey
// }
