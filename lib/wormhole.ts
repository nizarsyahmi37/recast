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

// ────────────────────────────────────────────────────────────
// Reverse-bridge (Solana → ETH) — Reclaim Vault
// ────────────────────────────────────────────────────────────

export type RedeemStep =
  | "idle" | "burning" | "attesting" | "claiming" | "complete" | "error"

export interface RedeemProgress {
  step: RedeemStep
  stepIndex: number
  totalSteps: number
  message: string
  txHash?: string
  error?: string
}

export interface WrappedNFT {
  id: string                    // unique id for this wrapped token
  collectionId: string          // links to demo collection id
  collectionName: string
  tokenId: string
  solanaMint: string            // wrapped NFT mint address on Solana
  originalEthContract: string   // ERC721 contract on ETH
  imageUrl: string
  bridgedAt: string             // ISO date
}

export const DEMO_WRAPPED_NFTS: WrappedNFT[] = [
  {
	id: "wrap-001",
	collectionId: "lostapes-eth",
	collectionName: "Lost Apes",
	tokenId: "#4201",
	solanaMint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
	originalEthContract: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
	imageUrl: "https://picsum.photos/seed/lostapes4201/400/400",
	bridgedAt: "2025-11-14T08:22:00Z",
  },
  {
	id: "wrap-002",
	collectionId: "pixelgrave-eth",
	collectionName: "Pixel Graves",
	tokenId: "#0777",
	solanaMint: "So1anaPixG4vE8A9FbK3mR7qN2wX5cYhPLjDuBsMnkTz",
	originalEthContract: "0x1A92f7381B9F03921564a437210bB9396471050C",
	imageUrl: "https://picsum.photos/seed/pixelgrave0777/400/400",
	bridgedAt: "2025-12-03T14:55:00Z",
  },
  {
	id: "wrap-003",
	collectionId: "voxeldead-eth",
	collectionName: "Voxel Dead",
	tokenId: "#1337",
	solanaMint: "So1anaVoxD9rK6sW2hF4qJ8nE1mT5yPbLcUgXiAoZvYe",
	originalEthContract: "0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a",
	imageUrl: "https://picsum.photos/seed/voxeldead1337/400/400",
	bridgedAt: "2026-01-18T21:10:00Z",
  },
  {
	id: "wrap-004",
	collectionId: "ethghosts-v2",
	collectionName: "ETH Ghosts V2",
	tokenId: "#0042",
	solanaMint: "So1anaGhst3pM7wA2jR9qF5nK1xE8hYcDbTuViOsLZmN",
	originalEthContract: "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e",
	imageUrl: "https://picsum.photos/seed/ethghosts0042/400/400",
	bridgedAt: "2026-02-01T09:30:00Z",
  },
]

const REDEEM_STEPS = [
  { step: "burning" as RedeemStep, message: "Burning wrapped NFT on Solana — sending to Wormhole NFT Bridge program..." },
  { step: "attesting" as RedeemStep, message: "Wormhole Guardians signing burn VAA — waiting for 13/19 signatures..." },
  { step: "claiming" as RedeemStep, message: "Submitting VAA to Ethereum NFT Bridge — releasing original ERC721..." },
]

export async function simulateRedeem(
  _nft: WrappedNFT,
  ethAddress: string,
  onProgress: (progress: RedeemProgress) => void
): Promise<{ ethTxHash: string }> {
  for (let i = 0; i < REDEEM_STEPS.length; i++) {
	const step = REDEEM_STEPS[i]
	onProgress({
	  step: step.step,
	  stepIndex: i + 1,
	  totalSteps: REDEEM_STEPS.length + 1,
	  message: step.message,
	})
	await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))
  }

  const ethTxHash = `0x${Math.random().toString(16).slice(2, 66).padEnd(64, "0")}`

  onProgress({
	step: "complete",
	stepIndex: REDEEM_STEPS.length + 1,
	totalSteps: REDEEM_STEPS.length + 1,
	message: `Original ERC721 released to ${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)} on Ethereum.`,
	txHash: ethTxHash,
  })

  return { ethTxHash }
}

// Production reverse-bridge using @certusone/wormhole-sdk + viem

// Solana NFT Bridge program ID (mainnet):
// 	WnFt12ZrnzZrFZkt2xsNsaNWoQribnuQ5B5FrDbwDhD

// Step 1 — Burn the wrapped Solana NFT via the NFT Bridge program:
// 	import { transferFromSolana } from "@certusone/wormhole-sdk"
// 	const { vaaBytes } = await transferFromSolana(
// 		solanaConnection, NFT_BRIDGE_SOLANA_PROGRAM_ID,
// 		WORMHOLE_SOLANA_PROGRAM_ID, payerPublicKey,
// 		wrappedMintAddress, ownerPublicKey,
// 		ETH_CHAIN_ID, ethRecipientBytes32
// 	)

// Step 2 — Poll Wormhole Guardian API for the signed VAA:
// 	GET https://api.wormholescan.io/v1/signed_vaa/1/{emitter}/{sequence}
// 	(chain ID 1 = Solana in Wormhole's numbering)

// Step 3 — Submit VAA to Ethereum NFT Bridge to release the original ERC721:
// 	await walletClient.writeContract({
// 		address: "0xf92cD566Ea4864356C5491c177A430C222d7e678",
// 		abi: parseAbi(["function completeTransfer(bytes memory encodedVm) external"]),
// 		functionName: "completeTransfer",
// 		args: [signedVaa],
// 	})

// ────────────────────────────────────────────────────────────
// Production forward-bridge (ETH → Solana) — original comments
// ────────────────────────────────────────────────────────────

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
