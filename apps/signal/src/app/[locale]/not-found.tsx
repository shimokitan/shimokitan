"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Locale, getDictionary, locales } from "@shimokitan/utils";
import { NotFound } from "@shimokitan/ui";

export default function NotFoundPage() {
  const pathname = usePathname();
  
  // Extract locale from pathname
  const segments = pathname?.split("/") || [];
  const locale = (locales as any).includes(segments[1]) ? segments[1] as Locale : "en";
  
  const dict = getDictionary(locale);
  const { not_found } = dict;

  return (
    <NotFound
      title={not_found.title}
      description={not_found.description}
      backToHomeLabel={not_found.back_to_district}
      statusLabel={not_found.status}
      homePath={`/${locale}`}
    />
  );
}
