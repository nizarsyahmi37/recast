"use client"

import type { NFTCollection } from "@/lib/types"

import { Skull, TrendingDown, Clock, Users } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getDeadnessLabel } from "@/lib/scanner"
import { cn } from "@/lib/utils"

import Image from "next/image"
import Link from "next/link"

interface CollectionCardProps {
	collection: NFTCollection
	compact?: boolean
}

export function CollectionCard({ collection, compact = false }: CollectionCardProps) {
	const { label, color } = getDeadnessLabel(collection.deadnessScore)

	return (
		<Card className="bg-zinc-900/80 border-zinc-700/50 hover:border-red-900/60 transition-all duration-300 overflow-hidden group">
			<div className="relative aspect-square overflow-hidden">
				<Image
					src={collection.imageUrl}
					alt={collection.name}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
					unoptimized
				/>
				{/* Dead overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />
				<div className="absolute top-3 left-3">
					<Badge variant="outline" className="border-red-800/60 bg-zinc-950/80 text-red-400 text-xs">
						<Skull className="w-3 h-3 mr-1" />
						{collection.standard}
					</Badge>
				</div>
				<div className="absolute top-3 right-3">
					<Badge className="bg-red-950/80 border border-red-800/40 text-red-300 text-xs font-mono">
						{collection.deadnessScore}% dead
					</Badge>
				</div>
			</div>

			<CardContent className="p-4">
				<h3 className="font-bold text-white text-lg leading-tight mb-1">{collection.name}</h3>
				<p className="text-zinc-500 text-xs font-mono mb-3 truncate">{collection.address}</p>

				{!compact && (
					<p className="text-zinc-400 text-sm mb-4 line-clamp-2">{collection.description}</p>
				)}

				<div className="space-y-2 mb-3">
					<div className="flex justify-between items-center text-xs">
						<span className={cn("font-medium", color)}>{label}</span>
						<span className="text-zinc-500">{collection.deadnessScore}/100</span>
					</div>
					<Progress
						value={collection.deadnessScore}
						className="h-1.5 bg-zinc-800"
					/>
				</div>

				<div className="grid grid-cols-3 gap-2 text-xs">
					<div className="text-center p-2 bg-zinc-800/50 rounded-lg">
						<TrendingDown className="w-3 h-3 mx-auto mb-1 text-red-400" />
						<div className="text-white font-mono font-bold">Ξ{collection.floorPrice}</div>
						<div className="text-zinc-500">floor</div>
					</div>
					<div className="text-center p-2 bg-zinc-800/50 rounded-lg">
						<Clock className="w-3 h-3 mx-auto mb-1 text-orange-400" />
						<div className="text-white font-mono font-bold">{collection.lastTransferDays}d</div>
						<div className="text-zinc-500">dead</div>
					</div>
					<div className="text-center p-2 bg-zinc-800/50 rounded-lg">
						<Users className="w-3 h-3 mx-auto mb-1 text-zinc-400" />
						<div className="text-white font-mono font-bold">{collection.holders.toLocaleString()}</div>
						<div className="text-zinc-500">holders</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0">
				<Link href={`/resurrect/${collection.id}`} className="w-full">
					<Button
						className="w-full bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-100 border border-red-800/40 hover:border-red-700 transition-all"
						size="sm"
					>
						<Skull className="w-4 h-4 mr-2" />
						Resurrect This Collection
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
