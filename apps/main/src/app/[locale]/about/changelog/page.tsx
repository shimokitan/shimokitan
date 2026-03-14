import { getDictionary, Locale } from "@shimokitan/utils";

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = (await params).locale;
    const dict = getDictionary(locale as Locale);
    const c = dict.changelog;

    return (
        <>
            <h1>{c.title}</h1>
            <p>{c.description}</p>

            <h2>{c.march_2026.title}</h2>
            <p><strong>{c.march_2026.subtitle}</strong></p>
            <ul>
                <li>{c.march_2026.l1}</li>
            </ul>

            <h2>{c.feb_2026.title}</h2>
            <p><strong>{c.feb_2026.subtitle}</strong></p>
            <ul>
                <li>{c.feb_2026.l1}</li>
            </ul>
        </>
    );
}
