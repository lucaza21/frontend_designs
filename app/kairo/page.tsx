import type { Metadata } from "next";
import KairoApp from "./KairoApp";

export const metadata: Metadata = {
  title: "Kairo",
};

export default function Page() {
  return <KairoApp />;
}
