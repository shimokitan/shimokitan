import { getDictionary, Locale } from "@shimokitan/utils";

export default async function ChangelogPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const locale = (await params).locale;
    const dict = getDictionary(locale);
    const c = dict.changelog;

    return (
        <>
            <h1>{c.title}</h1>
            <p>{c.description}</p>

            <h2>{c.v2_0_26.title}</h2>
            <p><strong>{c.v2_0_26.subtitle}</strong></p>
            <ul>
                <li>{c.v2_0_26.l1}</li>
                <li>{c.v2_0_26.l2}</li>
                <li>{c.v2_0_26.l3}</li>
                <li>{c.v2_0_26.l4}</li>
                <li>{c.v2_0_26.l5}</li>
            </ul>

            <h2>{c.v2_0_0.title}</h2>
            <p><strong>{c.v2_0_0.subtitle}</strong></p>
            <ul>
                <li>{c.v2_0_0.l1}</li>
                <li>{c.v2_0_0.l2}</li>
                <li>{c.v2_0_0.l3}</li>
                <li>{c.v2_0_0.l4}</li>
                <li>{c.v2_0_0.l5}</li>
            </ul>

            <h2>{c.v1_5_0.title}</h2>
            <p><strong>{c.v1_5_0.subtitle}</strong></p>
            <ul>
                <li>{c.v1_5_0.l1}</li>
                <li>{c.v1_5_0.l2}</li>
                <li>{c.v1_5_0.l3}</li>
            </ul>
        </>
    );
}
