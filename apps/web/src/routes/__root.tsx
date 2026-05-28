import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
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
        title: "Base",
      },
      {
        name: "description",
        content:
          "Base is a lightweight web app for managing Docker and Podman containers.",
      },
      {
        name: "application-name",
        content: "Base",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Base",
      },
      {
        name: "theme-color",
        content: "#ffffff",
      },
      {
        name: "color-scheme",
        content: "light dark",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Base",
      },
      {
        property: "og:description",
        content:
          "Base is a lightweight web app for managing Docker and Podman containers.",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: "Base",
      },
      {
        name: "twitter:description",
        content:
          "Base is a lightweight web app for managing Docker and Podman containers.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <p>This page doesn't exist!</p>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
