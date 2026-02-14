"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import { MainLayout } from "./MainLayout";
import { MaintenanceLayout } from "./MaintenanceLayout";
import { ComingSoon } from "../ComingSoon";

interface MaintenanceSwitcherProps {
    children: React.ReactNode;
    isMaintenance: boolean;
}

const LEGAL_ROUTES = ["/terms", "/privacy", "/community-guidelines", "/copyright", "/dmca", "/cookies", "/contact"];

export function MaintenanceSwitcher({ children, isMaintenance }: MaintenanceSwitcherProps) {
    const pathname = usePathname();

    // Normalizing for robust detection
    const normalizedPathname = (pathname || "").split('?')[0].replace(/\/$/, "") || "/";
    const isLegalRoute = LEGAL_ROUTES.some(route => {
        const normalizedRoute = route.replace(/\/$/, "") || "/";
        return normalizedPathname.toLowerCase() === normalizedRoute.toLowerCase();
    });

    if (isLegalRoute) {
        return <>{children}</>;
    }

    if (isMaintenance) {
        return (
            <MaintenanceLayout key="mt-layout">
                <ComingSoon />
            </MaintenanceLayout>
        );
    }

    return (
        <MainLayout key="main-layout">
            {children}
        </MainLayout>
    );
}
