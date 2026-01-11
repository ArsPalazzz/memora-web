"use client";

import { Suspense } from "react";
import { FullPageLoader } from "@/components/ui/Loader";
import ReviewClient from "@/components/review.client";

export default function ReviewPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ReviewClient />
    </Suspense>
  );
}
