import { FullPageLoader } from "@/components/ui/Loader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    redirect("/login");
  } else {
    redirect("/desks");
  }

  return <FullPageLoader />;
}
