"use client"

import type { RedeemProgress, RedeemStep } from "@/lib/wormhole"

import { Check, Loader2, Flame, Shield, Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const STEP_LABELS: Record<Exclude<RedeemStep, "idle" | "error">, string> = {
	burning: "Burn on Solana",
	attesting: "Wormhole Attestation",
	claiming: "Claim on Ethereum",
	complete: "Complete"
}

const STEP_ICONS = [
	<Flame key="burn" className="w-3 h-3" />,
	<Shield key="attest" className="w-3 h-3" />,
	<Wallet key="claim" className="w-3 h-3" />
]

const ACTIVE_STEPS: Exclude<RedeemStep, "idle" | "complete" | "error">[] = [
	"burning", "attesting", "claiming"
]

interface RedeemFlowProps {
	progress: RedeemProgress | null
	onStart: () => void
	isRunning: boolean
	ethAddress: string
	onEthAddressChange: (addr: string) => void
}

export function RedeemFlow({
	progress,
	onStart,
	isRunning,
	ethAddress,
	onEthAddressChange
}: RedeemFlowProps) {
	const isComplete = progress?.step === "complete"
	const isError = progress?.step === "error"

	const progressPercent = progress
		? Math.round((progress.stepIndex / progress.totalSteps) * 100)
		: 0

	const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(ethAddress)

	return (
		<div className="space-y-5">
			{/* ETH address input — shown before start */}
			{!isRunning && !isComplete && (
				<div className="space-y-2">
					<label className="text-zinc-400 text-sm">
						Ethereum address to receive the original ERC721
					</label>
					<input
						type="text"
						placeholder="0x..."
						value={ethAddress}
						onChange={(e) => onEthAddressChange(e.target.value)}
						className={cn(
							"w-full bg-zinc-800/40 border rounded-lg px-3 py-2.5 text-sm font-mono text-white placeholder-zinc-600 outline-none transition-colors",
							ethAddress && !isValidAddress
								? "border-red-700/60 focus:border-red-600"
								: "border-zinc-700/40 focus:border-amber-600/60"
						)}
					/>
					{ethAddress && !isValidAddress && (
						<p className="text-red-400 text-xs">Must be a valid 0x Ethereum address</p>
					)}
				</div>
			)}

			{/* Progress — shown during and after */}
			{(isRunning || isComplete || isError) && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-zinc-400 text-sm">Reclaim progress</span>
						<span className="text-zinc-400 text-sm font-mono">{progressPercent}%</span>
					</div>
					<Progress value={progressPercent} className="h-2 bg-zinc-800" />

					<div className="space-y-2">
						{ACTIVE_STEPS.map((step, i) => {
							const currentIndex = progress ? progress.stepIndex - 1 : -1
							const isDone = currentIndex > i
							const isActive = currentIndex === i

							return (
								<div
									key={step}
									className={cn(
										"flex items-center gap-3 p-3 rounded-lg border text-sm transition-all duration-500",
										isDone && "bg-green-950/20 border-green-900/30 text-green-300",
										isActive && "bg-amber-950/30 border-amber-800/40 text-amber-200",
										!isDone && !isActive && "bg-zinc-900/30 border-zinc-800/30 text-zinc-600"
									)}
								>
									<div
										className={cn(
											"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
											isDone && "bg-green-900/60",
											isActive && "bg-amber-900/60",
											!isDone && !isActive && "bg-zinc-800/60"
										)}
									>
										{isDone ? (
											<Check className="w-3 h-3" />
										) : isActive ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											STEP_ICONS[i]
										)}
									</div>
									<span>{STEP_LABELS[step]}</span>
									{isActive && (
										<span className="text-xs text-zinc-500 ml-auto line-clamp-1">
											{progress?.message}
										</span>
									)}
								</div>
							)
						})}
					</div>

					{isComplete && (
						<div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-4 text-center">
							<Check className="w-8 h-8 text-amber-400 mx-auto mb-2" />
							<p className="text-amber-300 font-semibold">Original NFT Released!</p>
							<p className="text-zinc-400 text-xs mt-1">
								Your ERC721 has been returned to your Ethereum wallet.
							</p>
							{progress?.txHash && (
								<p className="text-zinc-600 text-xs font-mono mt-2 break-all">
									ETH Tx: {progress.txHash.slice(0, 22)}...
								</p>
							)}
						</div>
					)}

					{isError && (
						<div className="bg-red-950/20 border border-red-800/30 rounded-xl p-4 text-center">
							<p className="text-red-300 font-semibold">Reclaim failed</p>
							<p className="text-zinc-500 text-xs mt-1">{progress?.error}</p>
						</div>
					)}
				</div>
			)}

			{/* Start button */}
			{!isRunning && !isComplete && (
				<Button
					onClick={onStart}
					disabled={!isValidAddress}
					className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5 disabled:opacity-40 disabled:cursor-not-allowed"
					size="lg"
				>
					<Flame className="w-5 h-5 mr-2" />
					Begin Reclaim
					<ArrowRight className="w-5 h-5 ml-2" />
				</Button>
			)}
		</div>
	)
}
