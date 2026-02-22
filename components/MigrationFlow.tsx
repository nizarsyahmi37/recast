"use client"

import type { BridgeProgress, BridgeStep } from "@/lib/wormhole"

import { Check, Loader2, ArrowRight, Skull, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const STEP_LABELS: Record<BridgeStep, string> = {
	idle: "Ready",
	approving: "Ethereum Approval",
	locking: "Wormhole Lock",
	attesting: "Guardian Attestation",
	minting: "Solana Mint",
	complete: "Resurrected",
	error: "Error"
}

// const STEP_ICONS: Record<BridgeStep, React.ReactNode> = {
// 	idle: <Skull className="w-4 h-4" />,
// 	approving: <Loader2 className="w-4 h-4 animate-spin" />,
// 	locking: <Loader2 className="w-4 h-4 animate-spin" />,
// 	attesting: <Loader2 className="w-4 h-4 animate-spin" />,
// 	minting: <Loader2 className="w-4 h-4 animate-spin" />,
// 	complete: <Check className="w-4 h-4" />,
// 	error: <Skull className="w-4 h-4" />
// }

const ACTIVE_STEPS: BridgeStep[] = ["approving", "locking", "attesting", "minting"]

interface MigrationFlowProps {
	progress: BridgeProgress | null
	onStart: () => void
	isRunning: boolean
	royaltyBps: number
	onRoyaltyChange: (bps: number) => void
}

export function MigrationFlow({
	progress,
	onStart,
	isRunning,
	royaltyBps,
	onRoyaltyChange
}: MigrationFlowProps) {
	const progressPercent = progress
		? Math.round((progress.stepIndex / progress.totalSteps) * 100)
		: 0

	const isComplete = progress?.step === "complete"
	const isError = progress?.step === "error"

	return (
		<div className="space-y-6">
			{/* Royalty config */}
			{!isRunning && !isComplete && (
				<div className="bg-zinc-900/60 border border-zinc-700/40 rounded-xl p-5 space-y-4">
					<h3 className="text-white font-semibold flex items-center gap-2">
						<Zap className="w-4 h-4 text-yellow-400" />
						Creator Royalty Configuration
					</h3>
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-zinc-400">Royalty on secondary sales</span>
							<span className="text-yellow-400 font-mono font-bold">{royaltyBps / 100}%</span>
						</div>
						<input
							type="range"
							min={0}
							max={1000}
							step={50}
							value={royaltyBps}
							onChange={(e) => onRoyaltyChange(Number(e.target.value))}
							className="w-full accent-red-600"
						/>
						<div className="flex justify-between text-xs text-zinc-500">
							<span>0%</span>
							<span className="text-yellow-500 text-xs">Enforced on every Solana resale</span>
							<span>10%</span>
						</div>
					</div>
					<p className="text-zinc-500 text-xs">
						Unlike Ethereum&apos;s royalty bypass era, Metaplex enforces this on-chain. You earn this
						percentage on every secondary sale — forever.
					</p>
				</div>
			)}

			{/* Bridge progress */}
			{(isRunning || isComplete || isError) && (
				<div className="space-y-4">
					<div className="flex justify-between items-center mb-1">
						<span className="text-zinc-400 text-sm">Bridge progress</span>
						<span className="text-zinc-400 text-sm font-mono">{progressPercent}%</span>
					</div>
					<Progress value={progressPercent} className="h-2 bg-zinc-800" />

					<div className="space-y-2">
						{ACTIVE_STEPS.map((step, i) => {
							const currentIndex = progress ? progress.stepIndex - 1 : -1
							const stepIndex = i
							const isDone = currentIndex > stepIndex
							const isActive = currentIndex === stepIndex

							return (
								<div
									key={step}
									className={cn(
										"flex items-center gap-3 p-3 rounded-lg border text-sm transition-all duration-500",
										isDone && "bg-green-950/20 border-green-900/30 text-green-300",
										isActive && "bg-red-950/30 border-red-800/40 text-red-200",
										!isDone && !isActive && "bg-zinc-900/30 border-zinc-800/30 text-zinc-600"
									)}
								>
									<div
										className={cn(
											"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
											isDone && "bg-green-900/60",
											isActive && "bg-red-900/60",
											!isDone && !isActive && "bg-zinc-800/60"
										)}
									>
										{isDone ? (
											<Check className="w-3 h-3" />
										) : isActive ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<span className="text-xs font-mono">{i + 1}</span>
										)}
									</div>
									<span>{STEP_LABELS[step]}</span>
									{isActive && (
										<span className="text-xs text-zinc-500 ml-auto">
											{progress?.message}
										</span>
									)}
								</div>
							)
						})}
					</div>

					{isComplete && (
						<div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4 text-center">
							<Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
							<p className="text-green-300 font-semibold">Collection Resurrected</p>
							{progress?.txHash && (
								<p className="text-zinc-500 text-xs font-mono mt-1 break-all">
									Wormhole Tx: {progress.txHash.slice(0, 20)}...
								</p>
							)}
						</div>
					)}
				</div>
			)}

			{/* Start button */}
			{!isRunning && !isComplete && (
				<Button
					onClick={onStart}
					className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
					size="lg"
				>
					<Skull className="w-5 h-5 mr-2" />
					Begin Resurrection
					<ArrowRight className="w-5 h-5 ml-2" />
				</Button>
			)}
		</div>
	)
}
