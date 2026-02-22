# RECAST — Resurrect Dead NFT Collections on Solana

> **Solana Graveyard Hackathon 2026** | 6 tracks | Solo submission

## The Problem

In 2022, millions of people minted NFT collections on Ethereum. By 2024, **98% were dead** with zero trading volume, abandoned Discord servers, assets worth nothing. The infrastructure that failed them was gas costs, wallet friction, and zero utility.

That infrastructure is gone. **RECAST is how you bring them back.**

## What RECAST Does

RECAST is a one-stop resurrection tool for dead Ethereum NFT collections. Creators connect their Ethereum wallet, select a dead collection, and RECAST:

1. **Bridges the collection** to Solana via Wormhole NFT Bridge, where originals will be locked in escrow and redeemable any time (Sunrise track)
2. **Deploys a gallery** with enforced creator royalties on Metaplex (Exchange Art track)
3. **Creates a Realms DAO** for all holders with governance power (Realms track)
4. **Airdrops a free revival cNFT** to every holder via Bubblegum (DRiP track)
5. **Generates a Blink**, a Solana Action URL that is shareable on X/Twitter (OrbitFlare track)
6. **Awards loyalty points** for participation via Torque (Torque track)

## Live Demo

[https://recastapp.vercel.app](https://recast.vercel.app)

## Track Coverage

| Track | Sponsor | Integration |
|-------|---------|-------------|
| Migrations | Sunrise | Wormhole NFT Bridge — ERC721 locked on ETH, wrapped Metaplex NFT minted on Solana |
| Art | Exchange Art | Metaplex royalty standard — enforced on-chain |
| DAOs | Realms | spl-governance — auto-provisioned DAO per collection |
| NFTs | DRiP | mpl-bubblegum — compressed NFT airdrop to all holders |
| Blinks | OrbitFlare | Solana Actions spec — `/api/actions/[id]` endpoint |
| Loyalty | Torque | Torque SDK — points for migration, voting, holding, sharing |

## Tech Stack

```
Frontend:
Next.js 16 + Tailwind CSS + shadcn/ui

ETH Layer:
wagmi + viem + RainbowKit (MetaMask connection)

Wormhole:
Wormhole NFT Bridge (lock-and-mint, ERC721 preserved in escrow)

Solana:
Solana Wallet Adapter + Metaplex Core

DAO:
@solana/spl-governance (Realms SDK)

Drops:
@metaplex-foundation/mpl-bubblegum (compressed NFTs)

Blinks:
Solana Actions spec (JSON endpoint)

Loyalty:
Torque Labs SDK

Storage:
Arweave (metadata permanence)

Deploy:
Vercel
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx                    # Landing page with graveyard narrative
├── scan/page.tsx               # ETH wallet scanner + deadness scorer
├── resurrect/[id]/page.tsx     # Bridge flow with Wormhole NFT Bridge
├── collection/[id]/page.tsx    # Gallery + DAO + Drop + Blink + Loyalty
└── api/actions/[id]/route.ts   # Solana Actions / Blinks endpoint

components/
├── WalletProvider.tsx          # Solana wallet adapter (Phantom etc.)
├── CollectionCard.tsx          # Dead collection display with deadness score
├── MigrationFlow.tsx           # Step-by-step Wormhole bridge UI
├── Gallery.tsx                 # Resurrected NFT gallery
├── DAOPanel.tsx                # Realms governance interface
└── LoyaltyWidget.tsx           # Torque points display

lib/
├── types.ts                    # Shared TypeScript types
├── scanner.ts                  # ETH NFT scanner + deadness algorithm
├── wormhole.ts                 # Wormhole NFT Bridge integration (lock-and-mint)
├── metaplex.ts                 # Solana NFT deployment via Metaplex
├── realms.ts                   # Realms DAO creation via spl-governance
├── drip.ts                     # Bubblegum compressed NFT drops
└── torque.ts                   # Torque loyalty points system
```

## Deadness Score Algorithm

A collection qualifies for resurrection if:
- Deployed on Ethereum mainnet (ERC-721 or ERC-1155)
- Floor price = 0 ETH (+40 points)
- Zero 30-day trading volume (+30 points)
- Last transfer > 365 days ago (+30 points)
- Score of 60+ = eligible for RECAST

## Blinks

Each resurrected collection gets a Solana Action URL:

```
GET /api/actions/{collectionId}
```

Returns the Solana Actions JSON spec with:
- "Claim Revival NFT" action (mints a free cNFT to the caller)
- "Join Collection DAO" action (links to Realms governance)
- "View Gallery" action (opens the collection page)

The `actions.json` file at the domain root enables Blink unfurling on X/Twitter.

## Graveyard Narrative

> "In 2022, millions of people minted NFT collections on Ethereum. By 2024, 98% were dead with zero trading volume, abandoned Discord servers, assets worth nothing. The infrastructure that failed them was gas costs, wallet friction, and zero utility. That infrastructure is gone. Solana now has 1.2M TPS, negligible fees, and Wormhole NFT Bridge for reversible cross-chain transfers. RECAST is how you bring them back."

---

Built for the Solana Graveyard Hackathon · Feb 12–27, 2026
