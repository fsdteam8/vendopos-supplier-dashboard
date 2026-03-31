import TanstackProvider from "@/lib/provider/TanStack-Provider";
import AuthProvider from "@/lib/provider/auth-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Montserrat, Poppins } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Supplier Dashboard",
  description: "Supplier Dashboard",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        media: "(prefers-color-scheme: light)",
      },
    ],
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${montserrat.variable} ${geistMono.variable} ${poppins.variable} font-sans antialiased`}
      >
        <TanstackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanstackProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
