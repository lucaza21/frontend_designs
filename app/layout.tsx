import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luis Carrasquilla — Frontend Creations",
  description:
    "Experimental landing pages exploring scroll-driven reveals, masked-image mosaics, and procedural real-time 3D on the web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
