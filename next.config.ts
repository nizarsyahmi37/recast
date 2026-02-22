import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos"
			},
			{
				protocol: "https",
				hostname: "arweave.net"
			},
			{
				protocol: "https",
				hostname: "nftstorage.link"
			},
			{
				protocol: "https",
				hostname: "*.ipfs.nftstorage.link"
			}
		]
	},
	turbopack: {},
	serverExternalPackages: [
		"pino-pretty",
		"lokijs",
		"encoding"
	]
}

export default nextConfig
