"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Locale, getDictionary } from "@shimokitan/utils";
import { ErrorDisplay } from "@shimokitan/ui";

/**
 * 403 Forbidden page.
 */
export default function ForbiddenPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const dict = getDictionary(locale);
  const { forbidden } = dict;

  return (
    <ErrorDisplay
      code={403}
      title={forbidden.title}
      description={forbidden.description}
      backToHomeLabel={forbidden.back_to_district}
      statusLabel={forbidden.status}
      homePath={`/${locale}`}
    />
  );
}
