import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "EBRR - Education Board for Registration & Results",
  description:
    "The official Rohingya Education Board for Registration & Results. Uniting community schools under one structured board for standardized examination, transparent results, and certified academic recognition.",
  keywords: [
    "EBRR",
    "education board",
    "Rohingya",
    "examination",
    "results",
    "school registration",
    "academic records",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
