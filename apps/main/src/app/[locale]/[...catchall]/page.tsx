import { notFound } from "next/navigation";

/**
 * Catch-all route to trigger the themed 404 page for any unmatched paths within a locale.
 */
export default function CatchAll() {
  notFound();
}
