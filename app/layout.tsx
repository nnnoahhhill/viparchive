import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archive",
  description: "Randomized real images with a fakes gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
