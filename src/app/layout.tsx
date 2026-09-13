import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import "remixicon/fonts/remixicon.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-quill/dist/quill.snow.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "GB-SME",
  description: "Enter price resource planning software for I Enterprise",
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&family=Geist:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&family=Manrope:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Nunito:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Quicksand:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
        </head>
        <body>{children}</body>
      </html>
    </Providers>
  );
}
