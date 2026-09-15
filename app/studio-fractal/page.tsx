import type { Metadata } from "next";
import StudioFractalApp from "./StudioFractalApp";

export const metadata: Metadata = {
  title: "Studio Fractal",
};

export default function Page() {
  return <StudioFractalApp />;
}
