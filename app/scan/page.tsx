"use client"

import type { NFTCollection } from "@/lib/types"

import { useState, useEffect, useCallback } from "react"
import { Skull, Loader2, Search, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CollectionCard } from "@/components/CollectionCard"
import { scanWalletCollections } from "@/lib/scanner"

import Link from "next/link"

export default function ScanPage() {
	const [isConnected, setIsConnected] = useState(false)
	const [walletAddress, setWalletAddress] = useState("")
	const [isScanning, setIsScanning] = useState(false)
	const [collections, setCollections] = useState<NFTCollection[]>([])
	const [hasScanned, setHasScanned] = useState(false)

	async function connectWallet() {
		// Simulate wallet connection (in production: use RainbowKit connect)
		setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
		setIsConnected(true)
	}
	

	const scanCollections = useCallback(async () => {
		if (!walletAddress) return
		setIsScanning(true)
		setHasScanned(false)
		try {
			// const result = await scanWalletCollections(walletAddress)
			const result = await scanWalletCollections()
			setCollections(result)
			setHasScanned(true)
		} finally {
			setIsScanning(false)
		}
	}, [walletAddress])

	useEffect(() => {
		if (isConnected && !hasScanned && !isScanning) {
			scanCollections()
		}
	}, [isConnected, hasScanned, isScanning, scanCollections])

	return (
		<main className="min-h-screen bg-zinc-950 text-white">
			{/* Nav */}
			<nav className="border-b border-zinc-800/60 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm">Back to RECAST</span>
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
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-black text-white mb-3">
						Find Your Dead Collections
					</h1>
					<p className="text-zinc-400 max-w-xl mx-auto">
						Connect your Ethereum wallet. We scan your NFT collections and rank them by deadness
						— floor price, volume, and days since last activity.
					</p>
				</div>

				{/* Wallet connection */}
				{!isConnected ? (
					<div className="max-w-md mx-auto">
						<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-8 text-center">
							<div className="w-16 h-16 bg-red-950/40 border border-red-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
								<Skull className="w-8 h-8 text-red-400" />
							</div>
							<h2 className="text-xl font-bold text-white mb-2">Connect Ethereum Wallet</h2>
							<p className="text-zinc-400 text-sm mb-6">
								We&apos;ll scan your wallet for ERC-721 and ERC-1155 collections that match our
								deadness criteria: floor price → 0, volume → 0, last transfer &gt; 180 days.
							</p>
							<Button
								onClick={connectWallet}
								className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5"
								size="lg"
							>
								<Search className="w-5 h-5 mr-2" />
								Connect MetaMask
							</Button>
							<p className="text-zinc-600 text-xs mt-4">
								Demo mode: uses pre-seeded test collections on Sepolia
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-8">
						{/* Connected state */}
						<div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-700/30 rounded-xl px-5 py-4">
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-green-400 rounded-full" />
								<span className="text-zinc-400 text-sm">Connected:</span>
								<span className="text-white font-mono text-sm">
									{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={scanCollections}
								disabled={isScanning}
								className="border-zinc-700 text-zinc-400 hover:text-white"
							>
								{isScanning ? (
									<Loader2 className="w-4 h-4 animate-spin mr-1" />
								) : (
									<Search className="w-4 h-4 mr-1" />
								)}
								Rescan
							</Button>
						</div>

						{/* Scanning state */}
						{isScanning && (
							<div className="text-center py-16">
								<Loader2 className="w-10 h-10 text-red-400 animate-spin mx-auto mb-4" />
								<p className="text-zinc-400">Scanning Ethereum NFT collections...</p>
								<p className="text-zinc-600 text-sm mt-2">Calculating deadness scores</p>
							</div>
						)}

						{/* Results */}
						{hasScanned && !isScanning && (
							<div>
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2 className="text-xl font-bold text-white">
											{collections.length} Dead Collections Found
										</h2>
										<p className="text-zinc-500 text-sm mt-1">Ranked by deadness score (highest first)</p>
									</div>
									<Badge className="bg-red-950/40 border border-red-800/40 text-red-300">
										<AlertCircle className="w-3 h-3 mr-1" />
										Ethereum Mainnet
									</Badge>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{collections.map((collection) => (
										<CollectionCard key={collection.id} collection={collection} />
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</main>
	)
}
