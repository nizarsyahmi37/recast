"use client"

import type { DAOInfo } from "@/lib/realms"

import { useState } from "react"
import { Vote, Users, CheckCircle2, XCircle, Loader2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DAOPanelProps {
	dao: DAOInfo
	onVote: (vote: "for" | "against") => Promise<void>
}

export function DAOPanel({ dao, onVote }: DAOPanelProps) {
	const [voting, setVoting] = useState<"for" | "against" | null>(null)
	const [voted, setVoted] = useState(false)

	const { defaultProposal } = dao
	const totalVotes = defaultProposal.votesFor + defaultProposal.votesAgainst
	const forPct = totalVotes > 0 ? Math.round((defaultProposal.votesFor / totalVotes) * 100) : 50

	async function handleVote(vote: "for" | "against") {
		setVoting(vote)
		await onVote(vote)
		setVoting(null)
		setVoted(true)
	}

	return (
		<div className="space-y-4">
			{/* DAO Header */}
			<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-xl p-5">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-950/60 border border-purple-800/40 rounded-lg flex items-center justify-center">
							<Building2 className="w-5 h-5 text-purple-400" />
						</div>
						<div>
							<h3 className="text-white font-bold">{dao.name}</h3>
							<p className="text-zinc-500 text-xs font-mono">{dao.address}</p>
						</div>
					</div>
					<Badge className="bg-purple-950/60 border border-purple-800/40 text-purple-300">
						Powered by Realms
					</Badge>
				</div>

				<div className="grid grid-cols-3 gap-3 text-center">
					<div className="bg-zinc-800/40 rounded-lg p-3">
						<Users className="w-4 h-4 mx-auto mb-1 text-zinc-400" />
						<div className="text-white font-bold">{dao.memberCount.toLocaleString()}</div>
						<div className="text-zinc-500 text-xs">Members</div>
					</div>
					<div className="bg-zinc-800/40 rounded-lg p-3">
						<Vote className="w-4 h-4 mx-auto mb-1 text-zinc-400" />
						<div className="text-white font-bold">{dao.proposalCount}</div>
						<div className="text-zinc-500 text-xs">Proposals</div>
					</div>
					<div className="bg-zinc-800/40 rounded-lg p-3">
						<CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-green-400" />
						<div className="text-white font-bold">1:1</div>
						<div className="text-zinc-500 text-xs">NFT = Vote</div>
					</div>
				</div>
			</div>

			{/* Active Proposal */}
			<Card className="bg-zinc-900/60 border-zinc-700/40">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<Badge className="bg-green-950/60 border border-green-800/40 text-green-300 text-xs">
							Active Proposal
						</Badge>
						<span className="text-zinc-500 text-xs">#{defaultProposal.id.slice(-6)}</span>
					</div>
					<h4 className="text-white font-semibold text-lg mt-2">{defaultProposal.title}</h4>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-zinc-400 text-sm">{defaultProposal.description}</p>

					{/* Vote count */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs text-zinc-500">
							<span className="text-green-400">{defaultProposal.votesFor} For</span>
							<span className="text-red-400">{defaultProposal.votesAgainst} Against</span>
						</div>
						<div className="relative h-2 bg-red-950/40 rounded-full overflow-hidden">
							<div
								className="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all duration-500"
								style={{ width: `${forPct}%` }}
							/>
						</div>
					</div>

					{/* Vote buttons */}
					{!voted ? (
						<div className="flex gap-3">
							<Button
								onClick={() => handleVote("for")}
								disabled={!!voting}
								className="flex-1 bg-green-950/40 hover:bg-green-900/60 text-green-300 border border-green-800/40"
							>
								{voting === "for" ? (
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
								) : (
									<CheckCircle2 className="w-4 h-4 mr-2" />
								)}
								Vote For
							</Button>
							<Button
								onClick={() => handleVote("against")}
								disabled={!!voting}
								className="flex-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40"
							>
								{voting === "against" ? (
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
								) : (
									<XCircle className="w-4 h-4 mr-2" />
								)}
								Vote Against
							</Button>
						</div>
					) : (
						<div className="bg-purple-950/20 border border-purple-800/30 rounded-lg p-3 text-center">
							<CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
							<p className="text-purple-300 text-sm font-medium">Vote cast on Realms</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
