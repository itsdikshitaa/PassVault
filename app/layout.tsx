import type React from "react"
import type { Metadata, Viewport } from "next"
import { Fraunces } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
import { PWARegister } from "@/components/pwa-register"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "SecurePass - Advanced Password Generator",
  description: "Generate secure passwords with our advanced interface and management tools",
  authors: [{ name: "Dikshita Konwar" }],
  creator: "Dikshita Konwar",
  applicationName: "SecurePass",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SecurePass",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#8a4931",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PWARegister />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
