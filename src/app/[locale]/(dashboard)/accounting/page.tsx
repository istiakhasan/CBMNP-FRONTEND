"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AccountingIndexPage() {
  const router = useRouter();
  const local = useLocale();

  useEffect(() => {
    router.replace(`/${local}/accounting/chart-of-accounts`);
  }, [router, local]);

  return null;
}
