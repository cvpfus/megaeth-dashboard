import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MegaETH Dashboard - Auction Analytics & Allocation Checker",
      },
      {
        name: "description",
        content:
          "Track MegaETH auction statistics, check allocation status, and monitor bidding activity in real-time.",
      },
      {
        name: "keywords",
        content:
          "MegaETH, auction, dashboard, allocation checker, blockchain, cryptocurrency, bidding, analytics",
      },
      {
        name: "author",
        content: "cvpfus_id",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "MegaETH Dashboard - Auction Analytics & Allocation Checker",
      },
      {
        property: "og:description",
        content:
          "Track MegaETH auction statistics, check allocation status, and monitor bidding activity in real-time.",
      },
      {
        property: "og:image",
        content: "/tanstack-circle-logo.png",
      },
      {
        property: "og:url",
        content: "https://mega.b8n.xyz",
      },
      {
        property: "og:site_name",
        content: "MegaETH Dashboard",
      },
      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "MegaETH Dashboard - Auction Analytics & Allocation Checker",
      },
      {
        name: "twitter:description",
        content:
          "Track MegaETH auction statistics, check allocation status, and monitor bidding activity in real-time.",
      },
      {
        name: "twitter:image",
        content: "/tanstack-circle-logo.png",
      },
      {
        name: "twitter:creator",
        content: "@cvpfus_id",
      },
      {
        name: "twitter:url",
        content: "https://mega.b8n.xyz",
      },
      // Additional meta tags
      {
        name: "theme-color",
        content: "#0f172a",
      },
      {
        name: "msapplication-TileColor",
        content: "#0f172a",
      },
      {
        name: "robots",
        content: "index, follow",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/tanstack-circle-logo.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://umami.b8n.xyz/script.js"
          data-website-id="01cbfc16-2c7b-45d9-854d-6f50a1ae1438"
        ></script>
        <HeadContent />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[TanStackQueryDevtools]}
          />
        )}
        <script
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <Scripts />
      </body>
    </html>
  );
}
