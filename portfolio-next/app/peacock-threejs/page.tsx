import type { Metadata } from "next";
import PeacockClientLoader from "./PeacockClientLoader";

export const metadata: Metadata = {
  title: "羽间 — A moment of wonder",
  description:
    "A fully procedural Three.js peacock: hand-painted canvas textures, mouse-steered wandering, and a hover-triggered tail fan.",
};

export default function Page() {
  return <PeacockClientLoader />;
}
