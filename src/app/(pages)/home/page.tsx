"use client";

import { Suspense } from "react";
import HomeClient from "../../../components/home.client";
import { FullPageLoader } from "@/components/ui/Loader";

export default function HomePage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <HomeClient />
    </Suspense>
  );
}
