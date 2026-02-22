// import type { NFTCollection, ResurrectionStatus } from "./types"
import type { NFTCollection } from "./types"

export type BridgeStep =
	| "idle"
	| "approving"
	| "locking"
	| "attesting"
	| "minting"
	| "complete"
	| "error"

export interface BridgeProgress {
	step: BridgeStep
	stepIndex: number
	totalSteps: number
	message: string
	txHash?: string
	error?: string
}

const BRIDGE_STEPS = [
	{ step: "approving" as BridgeStep, message: "Approving collection transfer on Ethereum..." },
	{ step: "locking" as BridgeStep, message: "Locking NFTs in Wormhole NFT Bridge contract..." },
	{ step: "attesting" as BridgeStep, message: "Wormhole Guardians attesting cross-chain message..." },
	{ step: "minting" as BridgeStep, message: "Minting collection on Solana via Metaplex..." },
	{ step: "complete" as BridgeStep, message: "Collection successfully resurrected on Solana!" },
]

export async function simulateBridge(
	collection: NFTCollection,
	royaltyBps: number,
	onProgress: (progress: BridgeProgress) => void
): Promise<{
	solanaMintAddress: string
	solanaCollectionId: string
}> {
	for (let i = 0; i < BRIDGE_STEPS.length - 1; i++) {
		const step = BRIDGE_STEPS[i]
		onProgress({
			step: step.step,
			stepIndex: i + 1,
			totalSteps: BRIDGE_STEPS.length,
			message: step.message,
		})
		// Simulate async work (2-4s per step)
		await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))
	}

	// Simulate final mint address
	const mockSolanaMint = `So1ana${Math.random().toString(36).substring(2, 10).toUpperCase()}${collection.id.slice(0, 6)}`
	const mockCollectionId = `${collection.id}-solana`

	onProgress({
		step: "complete",
		stepIndex: BRIDGE_STEPS.length,
		totalSteps: BRIDGE_STEPS.length,
		message: BRIDGE_STEPS[BRIDGE_STEPS.length - 1].message,
		txHash: `0x${Math.random().toString(16).slice(2, 66)}`
	})

	return {
		solanaMintAddress: mockSolanaMint,
		solanaCollectionId: mockCollectionId
	}
}

// Production: use @wormhole-foundation/sdk
// export async function bridgeWithWormhole(
// 	ethSigner: ethers.Signer,
// 	solanaSigner: anchor.Wallet,
// 	collectionAddress: string,
// 	tokenIds: string[]
// ) {
// 	const wh = await wormhole("Mainnet", [evm, solana])
// 	const srcChain = wh.getChain("Ethereum")
// 	const dstChain = wh.getChain("Solana")
// 	const ntt = await srcChain.getProtocol("Ntt", { ntt: NTT_CONTRACTS })
// 	const xfer = ntt.transfer(ethSigner.address, amount, dstChain, solanaSigner.publicKey)
// 	for await (const tx of xfer) { await srcChain.sendTransaction(tx, ethSigner) }
// }
