"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Locale, getDictionary } from "@shimokitan/utils";
import { ErrorDisplay } from "@shimokitan/ui";

/**
 * 401 Unauthorized page.
 */
export default function UnauthorizedPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const dict = getDictionary(locale);
  const { unauthorized } = dict;

  return (
    <ErrorDisplay
      code={401}
      title={unauthorized.title}
      description={unauthorized.description}
      backToHomeLabel={unauthorized.back_to_district}
      statusLabel={unauthorized.status}
      homePath={`/${locale}`}
    />
  );
}
