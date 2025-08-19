import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import "remixicon/fonts/remixicon.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-quill/dist/quill.snow.css";
const inter = Inter({ subsets: ["latin"] });
// export const metadata: Metadata = {
//   title: "GB-SME",
//   description: "Enter price resource planning software for I Enterprise",
// };
export const metadata = {
  title: 'My Next.js App',
  description: 'Next.js App with PWA',
  manifest: '/manifest.json',
  themeColor: '#317EFB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}
