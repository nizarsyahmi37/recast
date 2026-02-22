"use client"

import type { NFT } from "@/lib/types"

import { ExternalLink, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import Image from "next/image"

interface GalleryProps {
	nfts: NFT[]
	collectionName: string
	royaltyBps: number
}

export function Gallery({ nfts, collectionName, royaltyBps }: GalleryProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-white">{collectionName}</h2>
				<Badge className="bg-yellow-950/60 border border-yellow-800/40 text-yellow-300 font-mono">
					<Tag className="w-3 h-3 mr-1" />
					{royaltyBps / 100}% royalty enforced
				</Badge>
			</div>
			<p className="text-zinc-500 text-sm">
				Showing {nfts.length} NFTs · Exchange Art royalty standard enforced on-chain via Metaplex
			</p>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{nfts.map((nft) => (
					<NFTCard key={nft.tokenId} nft={nft} />
				))}
			</div>
		</div>
	)
}

function NFTCard({ nft }: { nft: NFT }) {
	return (
		<Card className="bg-zinc-900/60 border-zinc-700/40 hover:border-zinc-500/60 transition-all group overflow-hidden">
			<div className="relative aspect-square overflow-hidden">
				<Image
					src={nft.imageUrl}
					alt={nft.name}
					fill
					className="object-cover group-hover:scale-105 transition-transform duration-300"
					unoptimized
				/>
				<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-zinc-950/80 rounded-lg">
					<ExternalLink className="w-3 h-3 text-zinc-300" />
				</button>
			</div>
			<CardContent className="p-3">
				<p className="text-white font-medium text-sm truncate">{nft.name}</p>
				<div className="flex flex-wrap gap-1 mt-2">
					{nft.attributes.slice(0, 2).map((attr) => (
						<Badge
							key={attr.trait_type}
							variant="outline"
							className="text-xs border-zinc-700/50 text-zinc-400 py-0 px-1"
						>
							{attr.value}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
