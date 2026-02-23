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
	{ step: "complete" as BridgeStep, message: "Collection successfully resurrected on Solana!" }
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

// Production: call the Wormhole NFT Bridge contracts directly via viem.

// NOTE: @wormhole-foundation/sdk v2 registers "NftBridge" as a protocol name but has
// no platform implementation (EmptyPlatformMap). Use direct contract calls instead.

// NFT Bridge contract addresses (Ethereum mainnet):
// 	NFT Bridge:  0xf92cD566Ea4864356C5491c177A430C222d7e678
// 	Core Bridge: 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B

// The NFT Bridge LOCKS (not burns) the ERC721 — originals are redeemable any time.

// import { createWalletClient, http, parseAbi, pad } from "viem"
// import { mainnet } from "viem/chains"
// import { Connection, PublicKey } from "@solana/web3.js"

// const NFT_BRIDGE_ABI = parseAbi([
// 	"function transferNFT(address token, uint256 tokenID, uint16 recipientChain, bytes32 recipient, uint32 nonce) returns (uint64 sequence)",
// 	"function completeTransfer(bytes memory encodedVm) external"
// ])

// const NFT_BRIDGE_ADDRESS = "0xf92cD566Ea4864356C5491c177A430C222d7e678"
// const WORMHOLE_GUARDIAN_RPC = "https://api.wormholescan.io"
// const SOLANA_CHAIN_ID = 1 // Wormhole chain ID for Solana

// export async function bridgeNFT(
// 	walletClient: WalletClient,   // viem wallet client (MetaMask)
// 	solanaPubkey: PublicKey,
// 	collectionAddress: `0x${string}`,
// 	tokenId: bigint
// ) {
// 	// Step 1: Approve the NFT Bridge to transfer the token
// 	// (call ERC721.approve(NFT_BRIDGE_ADDRESS, tokenId) first)

// 	// Step 2: Lock the ERC721 in the Wormhole escrow, emit a VAA
// 	const recipientBytes32 = pad(solanaPubkey.toBytes(), { size: 32 })
// 	const sequence = await walletClient.writeContract({
// 		address: NFT_BRIDGE_ADDRESS,
// 		abi: NFT_BRIDGE_ABI,
// 		functionName: "transferNFT",
// 		args: [collectionAddress, tokenId, SOLANA_CHAIN_ID, recipientBytes32, 0]
// 	})

// 	// Step 3: Poll Wormhole Guardian API for the signed VAA
// 	// GET https://api.wormholescan.io/v1/signed_vaa/2/{emitter}/{sequence}
// 	// (chain ID 2 = Ethereum in Wormhole's numbering)

// 	// Step 4: Submit the VAA on Solana to mint the wrapped Metaplex NFT
// 	// Use @certusone/wormhole-sdk (v1) for the Solana redeem step:
// 	// import { redeemOnSolana } from "@certusone/wormhole-sdk"
// 	// await redeemOnSolana(solanaConnection, NFT_BRIDGE_SOLANA_PROGRAM_ID, payerPublicKey, signedVaa)

// 	// To redeem back on Ethereum (if ETH collection revives):
// 	// await walletClient.writeContract({
// 	// 	address: NFT_BRIDGE_ADDRESS, abi: NFT_BRIDGE_ABI,
// 	// 	functionName: "completeTransfer", args: [signedVaa]
// 	// })
// }
