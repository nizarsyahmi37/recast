export interface DAOConfig {
	name: string
	collectionMint: string
	creatorWallet: string
}

export interface DAOInfo {
	address: string
	name: string
	proposalCount: number
	memberCount: number
	defaultProposal: {
		id: string
		title: string
		description: string
		votesFor: number
		votesAgainst: number
		status: "active" | "passed" | "failed"
	}
}

const daoCache: Record<string, DAOInfo> = {}

export async function createDAO(config: DAOConfig): Promise<DAOInfo> {
	await new Promise((resolve) => setTimeout(resolve, 2000))

	const dao: DAOInfo = {
		address: `Realm${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
		name: `${config.name} DAO`,
		proposalCount: 1,
		memberCount: Math.floor(Math.random() * 500) + 100,
		defaultProposal: {
			id: `prop-${Math.random().toString(36).substring(2, 8)}`,
			title: "What utility should we add first?",
			description:
				"This collection has been resurrected on Solana. As a token holder, you now have governance power. Vote to decide what utility to add first: token gating, merch store, game access, or community events.",
			votesFor: 0,
			votesAgainst: 0,
			status: "active"
		}
	}

	daoCache[config.collectionMint] = dao
	return dao
}

export async function getDAO(collectionMint: string): Promise<DAOInfo | null> {
	await new Promise((resolve) => setTimeout(resolve, 300))
	return daoCache[collectionMint] ?? null
}

export async function castVote(
	daoAddress: string,
	// proposalId: string,
	vote: "for" | "against"
): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 1000))
	const dao = Object.values(daoCache).find((d) => d.address === daoAddress)
	if (dao) {
		if (vote === "for") dao.defaultProposal.votesFor += 1
		else dao.defaultProposal.votesAgainst += 1
	}
}

// Production: use @solana/spl-governance
// export async function createRealmOnChain(
// 	connection: Connection,
// 	payer: Keypair,
// 	name: string,
// 	communityMint: PublicKey,
// ) {
// 	const realmAddress = await withCreateRealm(
// 		instructions,
// 		GOVERNANCE_PROGRAM_ID,
// 		2,
// 		name,
// 		payer.publicKey,
// 		communityMint,
// 		payer.publicKey,
// 		undefined,
// 		new GoverningTokenConfigAccountArgs({ tokenType: GoverningTokenType.Liquid, voterWeightAddin: undefined }),
// 		undefined,
// 	)
// 	return realmAddress
// }
