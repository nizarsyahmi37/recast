"use client"

import { ReactNode, useMemo } from "react"
import {
	ConnectionProvider,
	WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import "@solana/wallet-adapter-react-ui/styles.css"

export function WalletProvider({ children }: { children: ReactNode }) {
	const network = WalletAdapterNetwork.Devnet
	const endpoint = useMemo(() => clusterApiUrl(network), [network])

	// Wallets are auto-detected from browser extensions
	const wallets = useMemo(() => [], [])

	return (
		<ConnectionProvider endpoint={endpoint}>
			<SolanaWalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</SolanaWalletProvider>
		</ConnectionProvider>
	)
}
