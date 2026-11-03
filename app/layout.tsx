import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/content";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { PreloaderProvider } from "@/components/providers/PreloaderProvider";
import { PageEnterProvider } from "@/components/providers/PageEnterProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { PageTransitionLoader, PageTransitionSquare } from "@/components/layout/PageTransition";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SyncBodyTheme } from "@/components/layout/SyncBodyTheme";
import { Footer } from "@/components/layout/Footer";

// aktiv-grotesk (reference) is Adobe-only; Inter Tight is the closest free neo-grotesk.
const sans = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-inter-tight" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: `${brand.name} — Portfolio`, // PLACEHOLDER
  description: "Placeholder description.", // PLACEHOLDER
};

export const viewport: Viewport = { themeColor: "#141314" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body data-theme="dark">
        <TransitionProvider>
          <PreloaderProvider>
            <PageEnterProvider>
              <LenisProvider />
              <SyncBodyTheme />
              <Preloader />
              <Header />
              <main>{children}</main>
              <Footer />
              <PageTransitionSquare />
              <PageTransitionLoader />
              <CustomCursor />
            </PageEnterProvider>
          </PreloaderProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
