"use client"

import React from 'react';
import { MainLayout } from "./MainLayout";

interface MaintenanceSwitcherProps {
    children: React.ReactNode;
    isMaintenance: boolean; // Kept for API compatibility but unused in logic now
}

export function MaintenanceSwitcher({ children }: MaintenanceSwitcherProps) {
    // Logic has been moved to edge proxy/middleware.
    // This component now strictly wraps content in the MainLayout.
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
