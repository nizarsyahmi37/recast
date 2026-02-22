export interface LoyaltyPoints {
	total: number
	breakdown: Array<{
		event: string
		points: number
		timestamp: number
		collectionId: string
	}>
}

const pointsCache: Record<string, LoyaltyPoints> = {}

const POINT_VALUES = {
	migration: 100,
	vote: 50,
	hold: 25,
	blink_share: 10
}

export function getPoints(walletAddress: string): LoyaltyPoints {
	return pointsCache[walletAddress] ?? { total: 0, breakdown: [] }
}

export async function awardPoints(
	walletAddress: string,
	event: keyof typeof POINT_VALUES,
	collectionId: string
): Promise<LoyaltyPoints> {
	await new Promise((resolve) => setTimeout(resolve, 500))

	const current = pointsCache[walletAddress] ?? { total: 0, breakdown: [] }
	const pts = POINT_VALUES[event]

	const labels: Record<string, string> = {
		migration: "Migrated collection to Solana",
		vote: "Voted on DAO proposal",
		hold: "Holding bonus (30 days)",
		blink_share: "Blink share led to a claim"
	}

	const updated: LoyaltyPoints = {
		total: current.total + pts,
		breakdown: [
			{
				event: labels[event],
				points: pts,
				timestamp: Date.now(),
				collectionId,
			},
			...current.breakdown
		]
	}

	pointsCache[walletAddress] = updated
	return updated
}

// Production: use Torque Labs SDK
// import { TorqueSDK } from "@torqueprotocol/sdk"
// const torque = new TorqueSDK({ apiKey: process.env.TORQUE_API_KEY! })
// await torque.campaigns.track({ event: "migration", userId: walletAddress })
