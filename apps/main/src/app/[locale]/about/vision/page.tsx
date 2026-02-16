import { getDictionary, Locale } from "@shimokitan/utils";

export default async function VisionPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const locale = (await params).locale;
    const dict = getDictionary(locale);
    const v = dict.about.vision;

    return (
        <>
            <h1>{v.title}</h1>

            <div className="p-4 mb-8 rounded-lg bg-violet-900/10 border border-violet-500/20 text-violet-300 text-sm font-mono leading-relaxed">
                <p className="m-0">{dict.about.vision_disclaimer}</p>
            </div>

            <section>
                <div>
                    <h2>{v.section1.title}</h2>
                    <p>{v.section1.content}</p>
                </div>

                <div>
                    <h2>{v.section2.title}</h2>
                    <p>{v.section2.content}</p>
                    <ul>
                        <li>{v.section2.l1}</li>
                        <li>{v.section2.l2}</li>
                        <li>{v.section2.l3}</li>
                        <li>{v.section2.l4}</li>
                        <li>{v.section2.l5}</li>
                    </ul>
                </div>

                <div>
                    <h2>{v.section3.title}</h2>
                    <p>{v.section3.content}</p>
                    <ul>
                        <li>{v.section3.l1}</li>
                        <li>{v.section3.l2}</li>
                        <li>{v.section3.l3}</li>
                        <li>{v.section3.l4}</li>
                    </ul>
                </div>

                <div>
                    <h2>{v.section4.title}</h2>
                    {"content" in v.section4 && (
                        <p>{v.section4.content}</p>
                    )}
                </div>

                <div>
                    <h2>{v.section5.title}</h2>
                    {"content" in v.section5 && (
                        <p>{v.section5.content}</p>
                    )}
                    {"l1" in v.section5 && (
                        <ul>
                            <li>{v.section5.l1}</li>
                            {"l2" in v.section5 && <li>{v.section5.l2}</li>}
                            {"l3" in v.section5 && <li>{v.section5.l3}</li>}
                            {"l4" in v.section5 && <li>{v.section5.l4}</li>}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}
