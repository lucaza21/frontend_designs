"use client";

import dynamic from "next/dynamic";

const PeacockApp = dynamic(() => import("./PeacockApp"), { ssr: false });

export default function PeacockClientLoader() {
  return <PeacockApp />;
}
