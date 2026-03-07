import { getDictionary, Locale } from "@shimokitan/utils";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const locale = (await params).locale;
    const dict = getDictionary(locale);

    return (
        <>
            <h1>{dict.about.title}</h1>

            <h2>{dict.about.q1}</h2>
            <p>{dict.about.a1_1}</p>
            <p>{dict.about.a1_2}</p>

            <h2>{dict.about.q2}</h2>
            <p>{dict.about.a2_1}</p>
            <p>{dict.about.a2_2}</p>

            <h2>{dict.about.q3}</h2>
            <p>{dict.about.a3_1}</p>
            <p>{dict.about.a3_2}</p>
            <ul>
                <li><strong>{dict.about.artifacts_label}</strong> -- {dict.about.artifacts_desc}</li>
                <li><strong>{dict.about.entities_label}</strong> -- {dict.about.entities_desc}</li>
                <li><strong>{dict.about.collections_label}</strong> -- {dict.about.collections_desc}</li>
                <li><strong>{dict.about.zines_label}</strong> -- {dict.about.zines_desc}</li>
            </ul>

            <h2>{dict.about.q4}</h2>
            <p>{dict.about.a4_1}</p>
            <p>{dict.about.a4_2}</p>
            <p className="italic opacity-80">{(dict.about as any).a4_3}</p>

            <h2>{dict.about.q5}</h2>
            <p>{dict.about.a5_1}</p>
            <p>{dict.about.a5_2}</p>

            <h2>{dict.about.q6}</h2>
            <p>{dict.about.a6_1}</p>

            <hr className="my-8 border-violet-500/20" />

            <h2>{dict.about.legal_notice_title}</h2>
            <p className="text-sm opacity-80">{dict.about.legal_notice_content_1}</p>
            <p className="text-sm opacity-80">{dict.about.legal_notice_content_2}</p>
        </>
    );
}
