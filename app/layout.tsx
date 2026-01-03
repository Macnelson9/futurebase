import type React from "react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import MiniAppInitializer from "@/components/miniapp-initializer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const appUrl =
    process.env.NEXT_PUBLIC_URL || "https://futurebase-live.vercel.app";

  return {
    title: "FutureBase",
    description:
      "Send encrypted memories to your future self on the blockchain",
    generator: "v0.app",
    icons: {
      icon: "/futurebase-logo.png",
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${appUrl}/og-image.png`,
        button: {
          title: "Launch FutureBase",
          action: {
            type: "launch_miniapp",
            name: "FutureBase",
            url: appUrl,
            splashImageUrl: `${appUrl}/splash-image.png`,
            splashBackgroundColor: "#000000",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MiniAppInitializer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
