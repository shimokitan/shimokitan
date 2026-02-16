"use client"

import { useParams } from "next/navigation";
import { ComingSoon } from "../../../components/ComingSoon";
import { MaintenanceLayout } from "../../../components/layout/MaintenanceLayout";
import { getDictionary, Locale } from "@shimokitan/utils";

export default function MaintenancePage() {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'en';
    const dict = getDictionary(locale);

    return (
        <MaintenanceLayout>
            <ComingSoon dict={dict} />
        </MaintenanceLayout>
    );
}
