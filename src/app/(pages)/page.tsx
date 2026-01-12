import { redirect } from "next/navigation";
import { ROUTES } from "@/routes/next";

export default async function RootPage() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (response.ok) {
      redirect(ROUTES.HOME);
    } else {
      redirect(ROUTES.LOGIN);
    }
  } catch (error) {
    redirect(ROUTES.LOGIN);
  }
}
