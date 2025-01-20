import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import 'remixicon/fonts/remixicon.css'
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-quill/dist/quill.snow.css';
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "IEP",
  description: "Enter price resource planning software for I Enterprise"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </Providers>
  );
}
