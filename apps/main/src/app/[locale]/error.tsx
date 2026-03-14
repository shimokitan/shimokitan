"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Locale, getDictionary, locales } from "@shimokitan/utils";
import { ErrorDisplay } from "@shimokitan/ui";

/**
 * Global error handler for the [locale] segment.
 * Displays a themed error page for runtime failures.
 * 
 * @param props - Component props containing error object and reset function
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g. /en/something -> en)
  const segments = pathname?.split("/") || [];
  const locale = (locales as any).includes(segments[1]) ? segments[1] as Locale : "en";
  
  const dict = getDictionary(locale);
  
  // Detect status code from error object if present
  const statusCode = (error as any).status || (error as any).code;
  
  // Mapping of status codes to dictionary keys
  const errorMap: Record<number, any> = {
    400: dict.bad_request,
    401: dict.unauthorized,
    403: dict.forbidden,
    404: dict.not_found,
    503: dict.maintenance,
  };

  const errorDict = errorMap[Number(statusCode)] || dict.error;

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Shimokitan System Fault:", error);
  }, [error]);

  return (
    <ErrorDisplay
      code={statusCode}
      title={errorDict.title}
      description={errorDict.description}
      backToHomeLabel={errorDict.back_to_district}
      statusLabel={errorDict.status}
      homePath={`/${locale}`}
      onReset={reset}
      resetLabel={errorDict.try_again || errorDict.action_label}
    />
  );
}
