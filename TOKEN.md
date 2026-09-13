# Token site template

This repo is the reusable site for most tokens. Copy it, then change **only** the brand knobs below. Do not rebuild the desk, tape, wallet, or rewards tracker unless the token’s mechanics are different.

## Change these

1. `src/lib/config.ts` — name, ticker, mint, pair, vaults, copy, X handle, asset paths
2. `src/lib/theme.ts` — colors (`bg`, `accent`, `ink`, etc.)
3. `src/lib/links.ts` defaults or `.env` — X, Telegram, DexScreener, pump.fun
4. `public/mascot.jpg` — circular token image (square photo is fine; the site crops it to a circle)
5. `public/pill.svg` or whatever `project.assets.mark` points at — rain + ticker mark
6. `.env` / Vercel env — mint, pair, RPC, Jupiter referral, site URL

## Leave these alone

Jupiter swap desk, wallet modal, DexScreener tape, holder-rewards RPC scan, price tape, meme desk layout, routing.

## New token checklist

- [ ] New folder or GitHub repo copied from this one
- [ ] `config.ts` + `theme.ts` + assets
- [ ] Vercel project + env vars
- [ ] Confirm mint, pair, and rewards vault on-chain
- [ ] Hard-refresh the live URL

## Default mechanics (this template)

CTO on pump.fun. 3% holder tax paid in PUMP. Jupiter buy desk. Official market on pump.fun. If a later token has no holder rewards, hide the rewards board — do not invent payouts.
