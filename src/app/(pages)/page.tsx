import { redirect } from "next/navigation";
import { ROUTES } from "@/routes/next";
import { headers } from "next/headers";

export default async function RootPage() {
  let redirectPath: string | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/auth/me`, {
      cache: "no-store",
      headers: {
        Cookie: (await headers()).get("cookie") || "",
      },
    });

    if (response.ok) {
      redirectPath = ROUTES.HOME;
    } else {
      redirectPath = ROUTES.LOGIN;
    }
  } catch (error) {
    redirectPath = ROUTES.LOGIN;
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  return null;
}
