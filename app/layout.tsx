import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ForgeFlow MES",
    template: "%s | ForgeFlow MES",
  },
  description:
    "Manufacturing execution platform for real-time production, quality, and inventory visibility.",
  applicationName: "ForgeFlow MES",
  keywords: [
    "Manufacturing Execution System",
    "MES",
    "Plex",
    "Smart Manufacturing Platform",
    "Quality Management",
    "ERP",
    "Supply Chain Planning",
    "Connected Worker",
  ],
  openGraph: {
    title: "ForgeFlow MES",
    description:
      "Manufacturing execution platform for real-time production, quality, and inventory visibility.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeFlow MES",
    description:
      "Manufacturing execution platform for real-time production, quality, and inventory visibility.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
