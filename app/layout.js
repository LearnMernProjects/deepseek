import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";

const inter= Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepStack",
  description: "A AI GENERATIVE FULL STACK APPLICATION",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider> 
      <AppContextProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
    
  );
}
