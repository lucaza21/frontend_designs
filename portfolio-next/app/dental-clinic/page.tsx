import type { Metadata } from "next";
import DentalClinicApp from "./DentalClinicApp";

export const metadata: Metadata = {
  title: "Dental Health — Quality Healthcare",
  description: "Clinic landing page built around a masked card mosaic technique.",
};

export default function Page() {
  return <DentalClinicApp />;
}
