export const appName = "Internet Protocol";
export const appTagline = "Asio networking for C++ and Unreal Engine";
export const appDescription =
	"Asio non-boost networking for C++17 and Unreal Engine — UDP, TCP, HTTP, WebSocket and RTMP live video with full control over connections and messages.";
export const appKeywords = [
	"Asio",
	"non-boost",
	"C++17",
	"Unreal Engine",
	"UE5",
	"Blueprint",
	"networking",
	"UDP",
	"TCP",
	"HTTP",
	"WebSocket",
	"RTMP",
	"RTMPS",
	"live streaming",
	"OpenSSL",
	"TLS",
	"header-only library",
];
export const docsRoute = "/docs";

/** Public origin, used for canonical URLs, the sitemap and Open Graph images. */
export const siteUrl = (
	import.meta.env.VITE_SITE_URL ??
	"https://internet-protocol-documentation.vercel.app"
).replace(/\/+$/, "");

export const ogImage = { path: "/og-image.png", width: 1200, height: 630 };
export const themeColor = "#0a0c0a";

export function absoluteUrl(path = "/") {
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const gitConfig = {
	user: "nathancmiguel",
	repo: "InternetProtocol-Documentation",
	branch: "master",
};

export const links = {
	library: "https://github.com/nathancmiguel/InternetProtocol",
	releases: "https://github.com/nathancmiguel/InternetProtocol/releases",
	fab: "https://www.fab.com/listings/4eb6260b-19ea-4629-a653-250ea1777b8d",
	showcase: "https://www.youtube.com/watch?v=SEgRcV7njLQ",
	unrealShowcase: "https://www.youtube.com/watch?v=n0eVonOsPXw",
	author: "https://nathan-miguel.vercel.app/",
};
