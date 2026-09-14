import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "600"],
  variable: "--font-noto-serif-sc",
});

export default function PeacockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cormorant.variable} ${notoSerifSC.variable}`}>
      {children}
    </div>
  );
}
