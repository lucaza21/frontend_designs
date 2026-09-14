import type { Metadata } from "next";
import DesertRuinsApp from "./DesertRuinsApp";

export const metadata: Metadata = {
  title: "Desert Ruins — Frontend Creations",
  description:
    "Scroll-driven assembly reveal landing page with a staged cinematic stage engine.",
};

export default function Page() {
  return <DesertRuinsApp />;
}
