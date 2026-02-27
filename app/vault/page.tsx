"use client"

import type { WrappedNFT, RedeemProgress } from "@/lib/wormhole"

import { useState } from "react"
import { ArrowLeft, Skull, Lock, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RedeemFlow } from "@/components/RedeemFlow"
import { DEMO_WRAPPED_NFTS, simulateRedeem } from "@/lib/wormhole"

import Link from "next/link"

function truncate(str: string, front = 6, back = 4) {
	if (str.length <= front + back + 3) return str
	return `${str.slice(0, front)}...${str.slice(-back)}`
}

export default function VaultPage() {
	const [isConnected, setIsConnected] = useState(false)
	const [selectedNFT, setSelectedNFT] = useState<WrappedNFT | null>(null)
	const [ethAddress, setEthAddress] = useState("")
	const [redeemProgress, setRedeemProgress] = useState<RedeemProgress | null>(null)
	const [isRunning, setIsRunning] = useState(false)

	async function handleStartRedeem() {
		if (!selectedNFT || !ethAddress) return
		setIsRunning(true)
		setRedeemProgress(null)
		await simulateRedeem(selectedNFT, ethAddress, (progress) => {
			setRedeemProgress(progress)
		})
		setIsRunning(false)
	}

	function handleSelectNFT(nft: WrappedNFT) {
		if (isRunning) return
		setSelectedNFT(nft)
		setRedeemProgress(null)
		setEthAddress("")
	}

	return (
		<main className="min-h-screen bg-zinc-950 text-white">
			{/* Nav */}
			<nav className="border-b border-zinc-800/60 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<Link href="/scan" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm">Back to Scanner</span>
					</Link>
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 bg-red-950/60 border border-red-800/40 rounded-lg flex items-center justify-center">
							<Skull className="w-3.5 h-3.5 text-red-400" />
						</div>
						<span className="font-bold text-lg">RECAST</span>
					</div>
				</div>
			</nav>

			<div className="max-w-6xl mx-auto px-6 py-12">
				{/* Hero */}
				<div className="text-center mb-10">
					<div className="w-16 h-16 bg-amber-950/40 border border-amber-800/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
						<Lock className="w-8 h-8 text-amber-400" />
					</div>
					<h1 className="text-4xl font-black text-white mb-3">Reclaim Vault</h1>
					<p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
						Your original ERC721s are safely locked in Wormhole escrow. Whoever holds
						the wrapped Solana NFT can claim the original at any time — just burn the
						wrapped token and the bridge releases the original back to your ETH wallet.
					</p>
				</div>

				{/* Explainer box */}
				<div className="max-w-2xl mx-auto mb-10">
					<div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-5 text-sm text-amber-200/80 leading-relaxed">
						<p>
							<span className="text-amber-300 font-semibold">How it works: </span>
							When a collection is bridged via Wormhole NFT Bridge, the original ERC721 is
							locked in escrow — never burned. Whoever holds the wrapped Solana NFT owns the
							rights to claim the original. Burn the wrapped token → Wormhole Guardians sign
							a VAA → Ethereum NFT Bridge releases the original to your address.
						</p>
					</div>
				</div>

				{/* Connect wallet CTA */}
				{!isConnected ? (
					<div className="max-w-md mx-auto">
						<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-8 text-center">
							<div className="w-12 h-12 bg-amber-950/40 border border-amber-800/30 rounded-xl flex items-center justify-center mx-auto mb-5">
								<Wallet className="w-6 h-6 text-amber-400" />
							</div>
							<h2 className="text-xl font-bold text-white mb-2">Connect Solana Wallet</h2>
							<p className="text-zinc-400 text-sm mb-6">
								We&apos;ll scan for wrapped RECAST NFTs in your wallet. Any NFT you hold
								can be redeemed for the original ERC721 on Ethereum.
							</p>
							<Button
								onClick={() => setIsConnected(true)}
								className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5"
								size="lg"
							>
								<Wallet className="w-5 h-5 mr-2" />
								Connect Phantom
							</Button>
							<p className="text-zinc-600 text-xs mt-4">
								Demo mode: shows pre-seeded wrapped NFTs
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
						{/* Left — wrapped NFT grid */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-bold text-white">Your Wrapped NFTs</h2>
								<Badge className="bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs">
									{DEMO_WRAPPED_NFTS.length} found
								</Badge>
							</div>

							<div className="grid grid-cols-2 gap-3">
								{DEMO_WRAPPED_NFTS.map((nft) => {
									const isSelected = selectedNFT?.id === nft.id
									return (
										<button
											key={nft.id}
											onClick={() => handleSelectNFT(nft)}
											disabled={isRunning}
											className={`text-left rounded-xl border transition-all duration-200 overflow-hidden group ${
												isSelected
													? "border-amber-600/60 bg-amber-950/20"
													: "border-zinc-700/40 bg-zinc-900/60 hover:border-zinc-600/60"
											} ${isRunning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
										>
											{/* NFT image */}
											<div className="aspect-square overflow-hidden">
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={nft.imageUrl}
													alt={`${nft.collectionName} ${nft.tokenId}`}
													className={`w-full h-full object-cover transition-all duration-300 ${
														isSelected ? "grayscale-0" : "grayscale group-hover:grayscale-0"
													}`}
												/>
											</div>

											{/* NFT details */}
											<div className="p-3 space-y-1">
												<p className="text-white text-xs font-semibold leading-tight">
													{nft.collectionName} {nft.tokenId}
												</p>
												<p className="text-zinc-500 text-xs font-mono">
													{truncate(nft.solanaMint)}
												</p>
												<p className="text-zinc-600 text-xs font-mono">
													ETH: {truncate(nft.originalEthContract)}
												</p>
												{isSelected && (
													<span className="inline-block text-xs text-amber-400 font-semibold mt-1">
														Selected ✓
													</span>
												)}
											</div>
										</button>
									)
								})}
							</div>
						</div>

						{/* Right — detail + redeem flow */}
						<div>
							{!selectedNFT ? (
								<div className="bg-zinc-900/40 border border-zinc-700/30 border-dashed rounded-2xl p-10 text-center text-zinc-500">
									<Lock className="w-8 h-8 mx-auto mb-3 opacity-40" />
									<p>Select a wrapped NFT to begin reclaiming the original</p>
								</div>
							) : (
								<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 space-y-6">
									{/* Selected NFT header */}
									<div className="flex gap-4 items-start">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={selectedNFT.imageUrl}
											alt={`${selectedNFT.collectionName} ${selectedNFT.tokenId}`}
											className="w-20 h-20 rounded-xl object-cover shrink-0"
										/>
										<div className="min-w-0 space-y-1">
											<h3 className="text-white font-bold">
												{selectedNFT.collectionName} {selectedNFT.tokenId}
											</h3>
											<p className="text-zinc-500 text-xs">
												Bridged {new Date(selectedNFT.bridgedAt).toLocaleDateString()}
											</p>
											<div className="space-y-0.5">
												<p className="text-zinc-600 text-xs font-mono truncate">
													Mint: {truncate(selectedNFT.solanaMint, 8, 6)}
												</p>
												<p className="text-zinc-600 text-xs font-mono truncate">
													ETH: {truncate(selectedNFT.originalEthContract, 8, 6)}
												</p>
											</div>
										</div>
									</div>

									<hr className="border-zinc-800/60" />

									{/* Redeem flow */}
									<RedeemFlow
										progress={redeemProgress}
										onStart={handleStartRedeem}
										isRunning={isRunning}
										ethAddress={ethAddress}
										onEthAddressChange={setEthAddress}
									/>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
