import { Geist, Silkscreen } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
});

export default function KairoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geist.className} ${silkscreen.variable} w-full bg-black`}
    >
      <style>{`html { scroll-behavior: smooth; }`}</style>
      {children}
    </div>
  );
}
