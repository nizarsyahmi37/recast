import { Skull, ArrowRight, Zap, Shield, Users, GitMerge, Droplets, Share2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"

const SPONSORS = [
	{ name: "Sunrise", track: "Migrations", bounty: "$7,000", color: "text-orange-400 border-orange-800/40 bg-orange-950/30" },
	{ name: "Exchange Art", track: "Art", bounty: "$5,000", color: "text-blue-400 border-blue-800/40 bg-blue-950/30" },
	{ name: "Realms", track: "DAOs", bounty: "$5,000", color: "text-purple-400 border-purple-800/40 bg-purple-950/30" },
	{ name: "DRiP", track: "NFTs", bounty: "$2,500", color: "text-green-400 border-green-800/40 bg-green-950/30" },
	{ name: "OrbitFlare", track: "Blinks", bounty: "$1,200", color: "text-cyan-400 border-cyan-800/40 bg-cyan-950/30" },
	{ name: "Torque", track: "Loyalty", bounty: "$1,000", color: "text-yellow-400 border-yellow-800/40 bg-yellow-950/30" }
]

const STEPS = [
	{
		icon: <GitMerge className="w-5 h-5" />,
		title: "Connect & Scan",
		desc: "Connect your Ethereum wallet. RECAST scans your dead collections and ranks them by deadness score.",
		sponsor: "Sunrise",
		color: "text-orange-400",
		bg: "bg-orange-950/20 border-orange-800/30"
	},
	{
		icon: <Zap className="w-5 h-5" />,
		title: "Bridge via Wormhole",
		desc: "One click bridges your collection from Ethereum to Solana using Wormhole NFT Bridge. Metadata preserved on Arweave.",
		sponsor: "Sunrise",
		color: "text-orange-400",
		bg: "bg-orange-950/20 border-orange-800/30"
	},
	{
		icon: <Shield className="w-5 h-5" />,
		title: "Gallery with Royalties",
		desc: "Your resurrected collection launches with a native gallery. Creator royalties enforced on every resale — forever.",
		sponsor: "Exchange Art",
		color: "text-blue-400",
		bg: "bg-blue-950/20 border-blue-800/30"
	},
	{
		icon: <Users className="w-5 h-5" />,
		title: "Auto-Create DAO",
		desc: "A Realms DAO is provisioned instantly. Holders get governance power (1 NFT = 1 vote). First proposal pre-loaded.",
		sponsor: "Realms",
		color: "text-purple-400",
		bg: "bg-purple-950/20 border-purple-800/30"
	},
	{
		icon: <Droplets className="w-5 h-5" />,
		title: "Free Revival Drop",
		desc: "Every holder receives a compressed NFT revival drop via Bubblegum. Free airdrop. Zero gas. Community reactivated.",
		sponsor: "DRiP",
		color: "text-green-400",
		bg: "bg-green-950/20 border-green-800/30"
	},
	{
		icon: <Share2 className="w-5 h-5" />,
		title: "Shareable Blink",
		desc: "Your collection gets a Blink — a Solana Action URL that works directly on X/Twitter. One link, viral distribution.",
		sponsor: "OrbitFlare",
		color: "text-cyan-400",
		bg: "bg-cyan-950/20 border-cyan-800/30"
	},
	{
		icon: <Trophy className="w-5 h-5" />,
		title: "Earn Loyalty Points",
		desc: "Participants earn points for migrating, voting, holding, and sharing. Redeemable for early access to future collections.",
		sponsor: "Torque",
		color: "text-yellow-400",
		bg: "bg-yellow-950/20 border-yellow-800/30"
	}
]

const STATS = [
	{ value: "98%", label: "of 2022 ETH NFT collections are dead" },
	{ value: "$0", label: "average floor price across dead collections" },
	{ value: "2M+", label: "holders of worthless JPEGs" },
	{ value: "Today", label: "is the day you bring them back" }
]

export default function HomePage() {
	return (
		<main className="min-h-screen bg-zinc-950 text-white">
			{/* Navigation */}
			<nav className="border-b border-zinc-800/60 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-red-950/60 border border-red-800/40 rounded-lg flex items-center justify-center">
							<Skull className="w-4 h-4 text-red-400" />
						</div>
						<span className="font-bold text-xl tracking-tight">RECAST</span>
						<Badge variant="outline" className="border-zinc-700/50 text-zinc-500 text-xs ml-2">
							Solana Graveyard Hackathon
						</Badge>
					</div>
					<Link href="/scan">
						<Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
							Start Resurrection
						</Button>
					</Link>
				</div>
			</nav>

			{/* Hero */}
			<section className="relative overflow-hidden border-b border-zinc-800/40">
				<div className="absolute inset-0 bg-linear-to-b from-red-950/10 via-transparent to-transparent" />
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-red-950/10 blur-[120px] rounded-full" />

				<div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
					<Badge className="border border-red-800/40 bg-red-950/30 text-red-300 mb-6 text-sm px-4 py-1.5">
						<Skull className="w-3.5 h-3.5 mr-2 animate-float inline" />
						Solana Graveyard Hackathon 2026
					</Badge>

					<h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6">
						<span className="text-white">Dead NFTs.</span>
						<br />
						<span className="text-red-500 animate-flicker">Resurrected.</span>
					</h1>

					<p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
						In 2022, millions minted NFT collections on Ethereum. By 2024,{" "}
						<span className="text-white font-semibold">98% were dead</span> — zero volume, abandoned
						communities, worthless JPEGs. The infrastructure that failed them is gone.
					</p>
					<p className="text-xl text-zinc-300 font-semibold max-w-2xl mx-auto mb-10">
						RECAST is how you bring them back.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link href="/scan">
							<Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6">
								<Skull className="w-5 h-5 mr-2" />
								Resurrect Your Collection
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
						</Link>
						<Button
							size="lg"
							variant="outline"
							className="border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white text-lg px-8 py-6"
							asChild
						>
							<a href="https://github.com/nizarsyahmi37/recast" target="_blank" rel="noopener noreferrer">
								View on GitHub
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="border-b border-zinc-800/40 py-12">
				<div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
					{STATS.map((stat) => (
						<div key={stat.label} className="text-center">
							<div className="text-3xl sm:text-4xl font-black text-red-400 font-mono mb-1">
								{stat.value}
							</div>
							<div className="text-zinc-500 text-sm">{stat.label}</div>
						</div>
					))}
				</div>
			</section>

			{/* Track sponsors */}
			<section className="border-b border-zinc-800/40 py-12">
				<div className="max-w-5xl mx-auto px-6">
					<p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-6">
						Built for 6 tracks in one product
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						{SPONSORS.map((s) => (
							<div
								key={s.name}
								className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${s.color}`}
							>
								<span>{s.name}</span>
								<span className="opacity-60">·</span>
								<span className="font-mono text-xs opacity-80">{s.bounty}</span>
							</div>
						))}
					</div>
					<p className="text-center text-zinc-600 text-xs mt-4 font-mono">
						Total bounty potential: $21,700
					</p>
				</div>
			</section>

			{/* Flow */}
			<section className="py-20 border-b border-zinc-800/40">
				<div className="max-w-5xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-white mb-3">The Resurrection Flow</h2>
						<p className="text-zinc-400 max-w-xl mx-auto">
							One linear journey. Every sponsor track activates at a different step.
						</p>
					</div>

					<div className="space-y-4">
						{STEPS.map((step, i) => (
							<div key={step.title} className="flex gap-4 sm:gap-6">
								<div
									className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${step.bg} ${step.color} z-10`}
								>
									{step.icon}
								</div>
								<div className={`flex-1 p-4 rounded-xl border ${step.bg}`}>
									<div className="flex items-center gap-2 mb-1">
										<span className="text-zinc-600 text-xs font-mono">0{i + 1}</span>
										<h3 className={`font-bold ${step.color}`}>{step.title}</h3>
										<Badge variant="outline" className="text-xs border-zinc-700/50 text-zinc-500 ml-auto">
											{step.sponsor}
										</Badge>
									</div>
									<p className="text-zinc-400 text-sm">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Graveyard narrative */}
			<section className="py-20 border-b border-zinc-800/40">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<blockquote className="text-xl sm:text-2xl text-zinc-300 leading-relaxed font-light italic">
						&quot;In 2022, millions of people minted NFT collections on Ethereum. By 2024, 98% were dead —
						zero trading volume, abandoned Discord servers, assets worth nothing. The infrastructure that
						failed them was gas costs, wallet friction, and zero utility.{" "}
						<span className="text-white font-semibold not-italic">
							That infrastructure is gone.
						</span>{" "}
						Solana now has 1.2M TPS, negligible fees, and Wormhole NFT Bridge for native cross-chain
						transfers. RECAST is how you bring them back.&quot;
					</blockquote>
				</div>
			</section>

			{/* CTA footer */}
			<section className="py-20">
				<div className="max-w-2xl mx-auto px-6 text-center">
					<Skull className="w-12 h-12 text-red-500 mx-auto mb-6 animate-float" />
					<h2 className="text-4xl font-black text-white mb-4">
						Your dead collection is waiting.
					</h2>
					<p className="text-zinc-400 mb-8">
						Connect your Ethereum wallet. We&apos;ll find your dead collections, score them by
						deadness, and walk you through the resurrection.
					</p>
					<Link href="/scan">
						<Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-10 py-7">
							<Skull className="w-6 h-6 mr-3" />
							Begin the Resurrection
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-zinc-800/40 py-6 px-6 text-center">
				<p className="text-zinc-600 text-sm">
					RECAST — Built for the Solana Graveyard Hackathon 2026 · Feb 12-27
				</p>
			</footer>
		</main>
	)
}
