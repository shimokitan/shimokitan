"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Locale, getDictionary } from "@shimokitan/utils";
import { ErrorDisplay } from "@shimokitan/ui";

/**
 * 503 Maintenance page.
 */
export default function MaintenancePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const dict = getDictionary(locale);
  const { maintenance } = dict;

  return (
    <ErrorDisplay
      code={503}
      title={maintenance.title}
      description={maintenance.description}
      backToHomeLabel={maintenance.back_to_district}
      statusLabel={maintenance.status}
      homePath={`/${locale}`}
    />
  );
}
