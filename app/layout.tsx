import type { Metadata } from "next"
import { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { WalletProvider } from "@/components/WalletProvider"

import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: [
		"latin"
	]
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: [
		"latin"
	]
})

export const metadata: Metadata = {
	title: "RECAST — Resurrect Dead NFT Collections on Solana",
	description: "98% of 2022 Ethereum NFT collections are dead. RECAST bridges them to Solana via Wormhole NFT Bridge and relaunches them with real utility: enforced royalties, Realms DAOs, compressed NFT drops, Blinks, and loyalty rewards.",
	openGraph: {
		title: "RECAST — Resurrect Dead NFT Collections on Solana",
		description: "Bridge dead ETH collections to Solana. Enforce royalties. Launch a DAO. Drop revival NFTs.",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "RECAST — Resurrect Dead NFT Collections on Solana",
		description: "98% of 2022 ETH NFT collections are dead. We built the tool to bring them back."
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 grain`}>
				<WalletProvider>
					{children}
				</WalletProvider>
			</body>
		</html>
	)
}
