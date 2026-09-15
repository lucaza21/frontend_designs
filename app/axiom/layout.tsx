import { Inter, Space_Mono } from "next/font/google";
import "./axiom.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

export default function AxiomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} ${spaceMono.variable} axiom-root`}>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      {children}
    </div>
  );
}
