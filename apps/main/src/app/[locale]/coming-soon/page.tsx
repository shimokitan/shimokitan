"use client"

import React from "react";
import { useParams } from "next/navigation";
import { ComingSoon } from "../../../components/ComingSoon";
import { MaintenanceLayout } from "../../../components/layout/MaintenanceLayout";
import { getDictionary, Locale } from "@shimokitan/utils";

export default function ComingSoonPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = (React.use(params) || { locale: 'en' }) as { locale: Locale };
    const dict = getDictionary(locale);

    return (
        <MaintenanceLayout>
            <ComingSoon dict={dict} />
        </MaintenanceLayout>
    );
}
