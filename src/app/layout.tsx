import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pop Reel",
  description: "A Tiktok Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider afterSignOutUrl="/">
        <body>
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
