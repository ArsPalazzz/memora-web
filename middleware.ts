/**
 * Vercel Edge: proxy /api/* → VITE_API_URL (same role as next.config rewrites).
 * Set VITE_API_URL in Vercel Project → Environment Variables (Production).
 */
export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: Request): Promise<Response> {
  const apiBase = process.env.VITE_API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return Response.json(
      { message: "VITE_API_URL is not configured on Vercel" },
      { status: 502 },
    );
  }

  const incoming = new URL(request.url);
  const path = incoming.pathname.replace(/^\/api/, "") || "/";
  const target = `${apiBase}${path}${incoming.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  return fetch(target, init);
}
