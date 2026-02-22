"use client"

import type { LoyaltyPoints } from "@/lib/torque"

import { Trophy, Zap, CheckCircle2, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LoyaltyWidgetProps {
	points: LoyaltyPoints
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
	"Migrated collection to Solana": <Zap className="w-3 h-3 text-yellow-400" />,
	"Voted on DAO proposal": <CheckCircle2 className="w-3 h-3 text-purple-400" />,
	"Holding bonus (30 days)": <Trophy className="w-3 h-3 text-blue-400" />,
	"Blink share led to a claim": <Share2 className="w-3 h-3 text-green-400" />
}

export function LoyaltyWidget({ points }: LoyaltyWidgetProps) {
	const tier =
		points.total >= 500
			? { name: "Resurrection Lord", color: "text-red-400 border-red-800/40 bg-red-950/40" }
			: points.total >= 200
			? { name: "Graveyard Hero", color: "text-orange-400 border-orange-800/40 bg-orange-950/40" }
			: points.total >= 100
			? { name: "Revival Agent", color: "text-yellow-400 border-yellow-800/40 bg-yellow-950/40" }
			: { name: "Newcomer", color: "text-zinc-400 border-zinc-700/40 bg-zinc-900/40" }

	return (
		<Card className="bg-zinc-900/60 border-zinc-700/40">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Trophy className="w-5 h-5 text-yellow-400" />
						<span className="text-white font-bold">RECAST Points</span>
					</div>
					<Badge className="bg-orange-950/40 border border-orange-800/40 text-orange-300 text-xs">
						Powered by Torque
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Total points display */}
				<div className="text-center py-4">
					<div className="text-5xl font-bold text-white font-mono">{points.total}</div>
					<div className="text-zinc-400 text-sm mt-1">total points earned</div>
					<Badge className={`mt-3 border ${tier.color}`}>{tier.name}</Badge>
				</div>

				{/* Point breakdown table */}
				<div className="space-y-1">
					{[
						{ label: "Migration event", pts: 100, earned: points.breakdown.some((b) => b.event.includes("Migrated")) },
						{ label: "First DAO vote", pts: 50, earned: points.breakdown.some((b) => b.event.includes("Voted")) },
						{ label: "Holding (30 days)", pts: 25, earned: false },
						{ label: "Blink share → claim", pts: 10, earned: points.breakdown.some((b) => b.event.includes("Blink")) }
					].map((item) => (
						<div
							key={item.label}
							className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${
								item.earned
									? "bg-green-950/20 border border-green-900/20"
									: "bg-zinc-800/30 border border-transparent"
							}`}
						>
							<div className="flex items-center gap-2">
								{item.earned ? (
									<CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
								) : (
									<div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />
								)}
								<span className={item.earned ? "text-zinc-200" : "text-zinc-500"}>{item.label}</span>
							</div>
							<span className={`font-mono font-bold ${item.earned ? "text-green-400" : "text-zinc-600"}`}>
								+{item.pts}
							</span>
						</div>
					))}
				</div>

				{/* Recent activity */}
				{points.breakdown.length > 0 && (
					<div className="border-t border-zinc-800 pt-4">
						<p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Recent Activity</p>
						<div className="space-y-2">
							{points.breakdown.slice(0, 3).map((item, i) => (
								<div key={i} className="flex items-center justify-between text-xs">
									<div className="flex items-center gap-1.5 text-zinc-400">
										{EVENT_ICONS[item.event]}
										<span>{item.event}</span>
									</div>
									<span className="text-yellow-400 font-mono">+{item.points}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
