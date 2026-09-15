import { Almarai, Instrument_Serif } from "next/font/google";
import "./studio-fractal.css";

const almarai = Almarai({
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
});

export default function StudioFractalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${almarai.className} ${instrumentSerif.variable} min-h-screen bg-black`}
    >
      <style>{`html { scroll-behavior: smooth; }`}</style>
      {children}
    </div>
  );
}
