"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Locale, getDictionary } from "@shimokitan/utils";
import { ErrorDisplay } from "@shimokitan/ui";

/**
 * 400 Bad Request page.
 */
export default function BadRequestPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const dict = getDictionary(locale);
  const { bad_request } = dict;

  return (
    <ErrorDisplay
      code={400}
      title={bad_request.title}
      description={bad_request.description}
      backToHomeLabel={bad_request.back_to_district}
      statusLabel={bad_request.status}
      homePath={`/${locale}`}
    />
  );
}
