import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Alkatra } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const alkatara = Alkatra({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ping Panda",
  description: "Created using JStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased ${alkatara.className} min-h-[calc(100vh-1px)] flex flex-col`}>
         <main className="relative flex-1 flex flex-col">

          <Providers>{children}</Providers>
         </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
