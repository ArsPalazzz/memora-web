import { redirect } from "next/navigation";
import { ROUTES } from "@/routes/next";

export default async function RootPage() {
  let redirectPath: string | null = null;

  try {
    redirectPath = ROUTES.HOME;
  } catch (error) {
    redirectPath = ROUTES.HOME;
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  return null;
}
