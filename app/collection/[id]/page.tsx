"use client"

import type { NFTCollection } from "@/lib/types"
import type { SolanaCollectionData } from "@/lib/metaplex"
import type { DAOInfo } from "@/lib/realms"
import type { LoyaltyPoints } from "@/lib/torque"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Skull, Share2, Loader2, Gift, Check, Copy, ExternalLink, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gallery } from "@/components/Gallery"
import { DAOPanel } from "@/components/DAOPanel"
import { LoyaltyWidget } from "@/components/LoyaltyWidget"
import { getCollectionById } from "@/lib/scanner"
import { getResurrectedCollection } from "@/lib/metaplex"
import { createDAO, getDAO, castVote } from "@/lib/realms"
import { createRevivalDrop, claimRevivalDrop, getDropStatus } from "@/lib/drip"
import { awardPoints } from "@/lib/torque"

import Link from "next/link"

type Tab = "gallery" | "dao" | "drop" | "blink" | "loyalty"

const DEMO_WALLET = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

export default function CollectionPage() {
	const params = useParams()
	const searchParams = useSearchParams()
	const collectionId = params.id as string
	const royaltyBps = Number(searchParams.get("royalty") ?? 500)

	const [activeTab, setActiveTab] = useState<Tab>("gallery")
	const [collection, setCollection] = useState<NFTCollection | null>(null)
	const [solanaData, setSolanaData] = useState<SolanaCollectionData | null>(null)
	const [dao, setDao] = useState<DAOInfo | null>(null)
	const [points, setPoints] = useState<LoyaltyPoints>({ total: 0, breakdown: [] })
	const [isDaoLoading, setIsDaoLoading] = useState(false)
	const [isDropLoading, setIsDropLoading] = useState(false)
	const [dropClaimed, setDropClaimed] = useState(false)
	const [blinkCopied, setBlinkCopied] = useState(false)

	const blinkUrl = typeof window !== "undefined"
		? `${window.location.origin}/api/actions/${collectionId}`
		: `/api/actions/${collectionId}`

	useEffect(() => {
		async function init() {
			const [col] = await Promise.all([
				getCollectionById(collectionId),
			])
			if (!col) return
			setCollection(col)

			const solana = await getResurrectedCollection(collectionId, col, royaltyBps)
			setSolanaData(solana)

			// Award migration points
			const pts = await awardPoints(DEMO_WALLET, "migration", collectionId)
			setPoints(pts)

			// Load DAO if exists
			const existingDao = await getDAO(solana.mintAddress)
			if (existingDao) {
				setDao(existingDao)
			} else {
				// Auto-create DAO
				setIsDaoLoading(true)
				const newDao = await createDAO({
					name: col.name,
					collectionMint: solana.mintAddress,
					creatorWallet: DEMO_WALLET,
				})
				setDao(newDao)
				setIsDaoLoading(false)
			}

			// Check drop status
			const drop = getDropStatus(collectionId)
			if (!drop) {
				setIsDropLoading(true)
				await createRevivalDrop(collectionId, col.holders)
				setIsDropLoading(false)
			}
		}
		init()
	}, [collectionId, royaltyBps])

	async function handleVote(vote: "for" | "against") {
		if (!dao) return
		// await castVote(dao.address, dao.defaultProposal.id, vote)
		await castVote(dao.address, vote)
		const pts = await awardPoints(DEMO_WALLET, "vote", collectionId)
		setPoints(pts)
		// Refresh DAO
		const updatedDao = await getDAO(solanaData?.mintAddress ?? "")
		if (updatedDao) setDao(updatedDao)
	}

	async function claimDrop() {
		setIsDropLoading(true)
		// await claimRevivalDrop(collectionId, DEMO_WALLET)
		await claimRevivalDrop(collectionId)
		setDropClaimed(true)
		setIsDropLoading(false)
	}

	function copyBlink() {
		navigator.clipboard.writeText(blinkUrl)
		setBlinkCopied(true)
		setTimeout(() => setBlinkCopied(false), 2000)
		awardPoints(DEMO_WALLET, "blink_share", collectionId).then(setPoints)
	}

	if (!collection || !solanaData) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<Loader2 className="w-8 h-8 text-red-400 animate-spin" />
			</div>
		)
	}

	const TABS: {
		id: Tab
		label: string
		badge?: string
	}[] = [
		{ id: "gallery", label: "Gallery" },
		{ id: "dao", label: "DAO", badge: dao ? "Live" : undefined },
		{ id: "drop", label: "Revival Drop" },
		{ id: "blink", label: "Blink" },
		{ id: "loyalty", label: "Points" }
	]

	return (
		<main className="min-h-screen bg-zinc-950 text-white">
			{/* Nav */}
			<nav className="border-b border-zinc-800/60 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<Link href="/scan" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm">Back to Scanner</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link href="/vault" className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
							<Lock className="w-3.5 h-3.5" /> Reclaim Vault
						</Link>
						<div className="flex items-center gap-2">
							<div className="w-7 h-7 bg-red-950/60 border border-red-800/40 rounded-lg flex items-center justify-center">
								<Skull className="w-3.5 h-3.5 text-red-400" />
							</div>
							<span className="font-bold text-lg">RECAST</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-6xl mx-auto px-6 py-8">
				{/* Collection header */}
				<div className="flex items-start justify-between mb-8">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<Badge className="bg-green-950/40 border border-green-800/40 text-green-300 text-xs">
								<Check className="w-3 h-3 mr-1" />
								Resurrected on Solana
							</Badge>
							<Badge variant="outline" className="border-zinc-700/50 text-zinc-400 text-xs">
								{collection.standard} → Metaplex
							</Badge>
						</div>
						<h1 className="text-3xl font-black text-white">{collection.name}</h1>
						<p className="text-zinc-400 text-sm mt-1">
							{collection.totalSupply.toLocaleString()} NFTs · {royaltyBps / 100}% royalty enforced
						</p>
						<p className="text-zinc-600 text-xs font-mono mt-1">{solanaData.mintAddress}</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={copyBlink}
						className="border-cyan-800/40 text-cyan-400 hover:border-cyan-700 hover:bg-cyan-950/20"
					>
						<Share2 className="w-4 h-4 mr-2" />
						Share Blink
					</Button>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 border-b border-zinc-800/50 mb-8 overflow-x-auto">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
								activeTab === tab.id
									? "border-red-500 text-white"
									: "border-transparent text-zinc-500 hover:text-zinc-300"
							}`}
						>
							{tab.label}
							{tab.badge && (
								<span className="bg-green-950/60 text-green-400 text-xs px-1.5 py-0.5 rounded-full border border-green-800/40">
									{tab.badge}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Tab content */}
				{activeTab === "gallery" && (
					<Gallery
						nfts={solanaData.nfts}
						collectionName={collection.name}
						royaltyBps={royaltyBps}
					/>
				)}

				{activeTab === "dao" && (
					<div>
						{isDaoLoading ? (
							<div className="text-center py-16">
								<Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
								<p className="text-zinc-400">Creating Realms DAO for {collection.name}...</p>
								<p className="text-zinc-600 text-sm mt-1">Provisioning governance token · Setting up proposals</p>
							</div>
						) : dao ? (
							<div className="max-w-xl mx-auto">
								<DAOPanel dao={dao} onVote={handleVote} />
							</div>
						) : null}
					</div>
				)}

				{activeTab === "drop" && (
					<div className="max-w-md mx-auto">
						<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-8 text-center space-y-6">
							<div className="w-16 h-16 bg-green-950/40 border border-green-800/30 rounded-2xl flex items-center justify-center mx-auto">
								<Gift className="w-8 h-8 text-green-400" />
							</div>
							<div>
								<h2 className="text-xl font-bold text-white mb-2">{collection.name} Revival Drop</h2>
								<p className="text-zinc-400 text-sm">
									Every holder of the original Ethereum collection gets a free compressed NFT
									airdrop. Powered by Metaplex Bubblegum — zero gas, permanent on-chain.
								</p>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm">
								<div className="bg-zinc-800/40 rounded-xl p-4">
									<div className="text-2xl font-bold text-white font-mono">{collection.holders.toLocaleString()}</div>
									<div className="text-zinc-500 text-xs mt-1">Eligible holders</div>
								</div>
								<div className="bg-zinc-800/40 rounded-xl p-4">
									<div className="text-2xl font-bold text-green-400 font-mono">FREE</div>
									<div className="text-zinc-500 text-xs mt-1">Cost to claim</div>
								</div>
							</div>

							<Badge className="bg-green-950/30 border border-green-800/30 text-green-400 text-xs">
								DRiP-style compressed NFT via Bubblegum
							</Badge>

							{!dropClaimed ? (
								<Button
									onClick={claimDrop}
									disabled={isDropLoading}
									className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-5"
									size="lg"
								>
									{isDropLoading ? (
										<Loader2 className="w-5 h-5 animate-spin mr-2" />
									) : (
										<Gift className="w-5 h-5 mr-2" />
									)}
									Claim Revival Drop
								</Button>
							) : (
								<div className="bg-green-950/20 border border-green-800/30 rounded-xl p-4">
									<Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
									<p className="text-green-300 font-semibold">Revival NFT Claimed!</p>
									<p className="text-zinc-500 text-xs mt-1">Your compressed NFT is in your Phantom wallet</p>
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === "blink" && (
					<div className="max-w-lg mx-auto space-y-6">
						<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 space-y-5">
							<div className="flex items-center gap-2">
								<Share2 className="w-5 h-5 text-cyan-400" />
								<h2 className="text-xl font-bold text-white">Collection Blink</h2>
								<Badge className="bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs ml-auto">
									OrbitFlare
								</Badge>
							</div>
							<p className="text-zinc-400 text-sm">
								Your Blink is a Solana Action URL. Share it on X/Twitter and former holders can
								claim their revival NFT without leaving the platform.
							</p>

							{/* Blink preview card */}
							<div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden">
								<div className="bg-zinc-700/30 px-4 py-2 text-xs text-zinc-400 border-b border-zinc-700/30">
									Phantom wallet preview
								</div>
								<div className="p-4">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-red-950/60 rounded-lg flex items-center justify-center">
											<Skull className="w-5 h-5 text-red-400" />
										</div>
										<div>
											<p className="text-white font-semibold text-sm">{collection.name}</p>
											<p className="text-zinc-500 text-xs">RECAST · Solana</p>
										</div>
									</div>
									<p className="text-zinc-300 text-sm mb-3">
										Claim your {collection.name} revival NFT — free compressed NFT for all original holders.
									</p>
									<div className="bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg text-center">
										Claim Revival NFT
									</div>
								</div>
							</div>

							{/* Blink URL */}
							<div className="space-y-2">
								<p className="text-zinc-500 text-xs uppercase tracking-wider">Blink URL</p>
								<div className="flex gap-2">
									<div className="flex-1 bg-zinc-800/40 border border-zinc-700/30 rounded-lg px-3 py-2.5 text-sm font-mono text-zinc-300 truncate">
										{blinkUrl}
									</div>
									<Button
										onClick={copyBlink}
										size="sm"
										className="bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40"
									>
										{blinkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
									</Button>
								</div>
							</div>

							<div className="flex gap-3">
								<Button
									className="flex-1 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700/40"
									size="sm"
									asChild
								>
									<a
										href={`https://x.com/intent/tweet?text=${encodeURIComponent(`My dead NFT collection ${collection.name} is BACK on Solana 🔥 Claim your free revival NFT: ${blinkUrl}`)}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Share on X
									</a>
								</Button>
							</div>
						</div>

						<p className="text-zinc-600 text-xs text-center">
							Registered at actions.json · Compliant with Solana Actions spec · Powered by OrbitFlare
						</p>
					</div>
				)}

				{activeTab === "loyalty" && (
					<div className="max-w-md mx-auto">
						<LoyaltyWidget points={points} />
					</div>
				)}
			</div>
		</main>
	)
}
