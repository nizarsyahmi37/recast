"use client"

import type { NFTCollection } from "@/lib/types"
import type { BridgeProgress } from "@/lib/wormhole"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Skull, Clock, Users, TrendingDown, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MigrationFlow } from "@/components/MigrationFlow"
import { getCollectionById } from "@/lib/scanner"
import { simulateBridge } from "@/lib/wormhole"

import Link from "next/link"
import Image from "next/image"

export default function ResurrectPage() {
	const params = useParams()
	const router = useRouter()
	const collectionId = params.id as string

	const [collection, setCollection] = useState<NFTCollection | null>(null)
	const [royaltyBps, setRoyaltyBps] = useState(500) // 5%
	const [bridgeProgress, setBridgeProgress] = useState<BridgeProgress | null>(null)
	const [isRunning, setIsRunning] = useState(false)
	const [solanaMint, setSolanaMint] = useState<string | null>(null)

	useEffect(() => {
		getCollectionById(collectionId).then(setCollection)
	}, [collectionId])

	async function startBridge() {
		if (!collection) return
		setIsRunning(true)

		// const { solanaMintAddress, solanaCollectionId } = await simulateBridge(
		const { solanaMintAddress, } = await simulateBridge(
			collection,
			royaltyBps,
			(progress) => setBridgeProgress(progress)
		)

		setSolanaMint(solanaMintAddress)

		// Navigate to collection page after 2s
		setTimeout(() => {
			router.push(`/collection/${collectionId}?mint=${solanaMintAddress}&royalty=${royaltyBps}`)
		}, 2000)
	}

	if (!collection) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<Skull className="w-8 h-8 text-red-400 animate-float" />
			</div>
		)
	}

	// const { label, color } = getDeadnessLabel(collection.deadnessScore)

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

			<div className="max-w-5xl mx-auto px-6 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Collection info panel */}
					<div className="space-y-5">
						<div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-700/40">
							<Image
								src={collection.imageUrl}
								alt={collection.name}
								fill
								className="object-cover grayscale"
								unoptimized
							/>
							{/* Ghost overlay */}
							<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
							<div className="absolute bottom-5 left-5 right-5">
								<div className="flex items-center gap-2 mb-2">
									<Badge className="bg-red-950/80 border border-red-800/40 text-red-300 text-sm font-mono">
										{collection.deadnessScore}% dead
									</Badge>
									<Badge variant="outline" className="border-zinc-600/50 text-zinc-400">
										{collection.standard}
									</Badge>
								</div>
								<h1 className="text-2xl font-black text-white">{collection.name}</h1>
								<p className="text-zinc-400 text-xs font-mono mt-1">{collection.address}</p>
							</div>
						</div>

						<p className="text-zinc-400 text-sm">{collection.description}</p>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-3">
							<div className="bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-4 text-center">
								<TrendingDown className="w-4 h-4 mx-auto mb-2 text-red-400" />
								<div className="text-white font-mono font-bold text-lg">Ξ{collection.floorPrice}</div>
								<div className="text-zinc-500 text-xs">Floor Price</div>
							</div>
							<div className="bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-4 text-center">
								<Clock className="w-4 h-4 mx-auto mb-2 text-orange-400" />
								<div className="text-white font-mono font-bold text-lg">{collection.lastTransferDays}d</div>
								<div className="text-zinc-500 text-xs">Since Transfer</div>
							</div>
							<div className="bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-4 text-center">
								<Users className="w-4 h-4 mx-auto mb-2 text-zinc-400" />
								<div className="text-white font-mono font-bold text-lg">{collection.holders.toLocaleString()}</div>
								<div className="text-zinc-500 text-xs">Holders</div>
							</div>
						</div>

						{/* What happens */}
						<div className="bg-zinc-900/40 border border-zinc-700/30 rounded-xl p-5 space-y-3">
							<h3 className="text-white font-semibold text-sm">What happens when you resurrect:</h3>
							{[
								{ text: "Collection locked & bridged to Solana via Wormhole NFT Bridge", sponsor: "Sunrise" },
								{ text: "Gallery deployed with enforced royalties", sponsor: "Exchange Art" },
								{ text: "Realms DAO created for all holders", sponsor: "Realms" },
								{ text: "Free revival cNFT airdropped to holders", sponsor: "DRiP" },
								{ text: "Shareable Blink generated for your collection", sponsor: "OrbitFlare" },
								{ text: "Loyalty points awarded for migration", sponsor: "Torque" }
							].map(({ text, sponsor }) => (
								<div key={text} className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2 text-zinc-300">
										<div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
										{text}
									</div>
									<span className="text-zinc-600 text-xs">{sponsor}</span>
								</div>
							))}
						</div>
					</div>

					{/* Migration flow panel */}
					<div>
						<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6">
							<div className="flex items-center gap-2 mb-6">
								<Skull className="w-5 h-5 text-red-400" />
								<h2 className="text-xl font-bold text-white">Resurrection Console</h2>
							</div>

							<MigrationFlow
								progress={bridgeProgress}
								onStart={startBridge}
								isRunning={isRunning}
								royaltyBps={royaltyBps}
								onRoyaltyChange={setRoyaltyBps}
							/>

							{solanaMint && (
								<div className="mt-4 bg-zinc-800/40 rounded-xl p-4">
									<p className="text-zinc-400 text-xs mb-1">Solana Mint Address</p>
									<p className="text-green-300 font-mono text-sm break-all">{solanaMint}</p>
								</div>
							)}
						</div>

						{/* Wormhole attribution */}
						<div className="mt-4 flex items-center gap-2 text-zinc-600 text-xs px-1">
							<ExternalLink className="w-3 h-3" />
							<span>Powered by Wormhole NFT Bridge · Sunrise Migrations Track</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
