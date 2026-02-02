import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Makler CRM — Sales Overlay",
  description: "Sales-Focused CRM Overlay für Immobilienmakler",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
