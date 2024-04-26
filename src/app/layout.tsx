import type { Metadata } from "next";
import { notosans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord",
  description: "Discord message reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notosans.className}>
      <body>{children}</body>
    </html>
  );
}
