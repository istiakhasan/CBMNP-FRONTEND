"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getUserInfo } from "@/service/authService";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectUser = async () => {
      const user:any = await getUserInfo(); // should return { role: "super_admin" } or similar

      if (!user) {
        router.push(`/${locale}/login`); // if not logged in
        return;
      }

      if (user.role === "super_admin") {
        router.push(`/${locale}/super-admin/dashboard/`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    };

    redirectUser().finally(() => setLoading(false));
  }, [locale, router]);

  // Optional: show a loading state while redirecting
  if (loading) {
    return <p>Redirecting...</p>;
  }

  return null;
}
