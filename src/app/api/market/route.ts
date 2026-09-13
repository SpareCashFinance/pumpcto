import { getMarketSnapshot } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET() {
  const market = await getMarketSnapshot();
  return Response.json(market, {
    headers: {
      "cache-control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
