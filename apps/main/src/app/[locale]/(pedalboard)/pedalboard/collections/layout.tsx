
import React from 'react';

export default function CollectionsLayout({
    children,
    modal,
    params
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
