import React from "react";
import Spot from "@/components/featured/Spot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spot Trading",
};

function SpotPage() {
  return (
    <div>
      <Spot />
    </div>
  );
}

export default SpotPage;
