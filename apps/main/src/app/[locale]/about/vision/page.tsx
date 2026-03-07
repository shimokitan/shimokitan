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
                        {"l3" in v.section2 && <li>{(v.section2 as any).l3}</li>}
                        {"l4" in v.section2 && <li>{(v.section2 as any).l4}</li>}
                        {"l5" in v.section2 && <li>{(v.section2 as any).l5}</li>}
                    </ul>
                </div>

                <div>
                    <h2>{v.section3.title}</h2>
                    <p>{v.section3.content}</p>
                    <ul>
                        <li>{v.section3.l1}</li>
                        <li>{v.section3.l2}</li>
                        <li>{v.section3.l3}</li>
                        {"l4" in v.section3 && <li>{(v.section3 as any).l4}</li>}
                        {"l5" in v.section3 && <li>{(v.section3 as any).l5}</li>}
                    </ul>
                </div>

                <div>
                    <h2>{v.section4.title}</h2>
                    <p>{v.section4.content}</p>
                    <ul>
                        <li>{v.section4.l1}</li>
                        <li>{v.section4.l2}</li>
                        <li>{v.section4.l3}</li>
                        {"l4" in v.section4 && <li>{(v.section4 as any).l4}</li>}
                        {"l5" in v.section4 && <li>{(v.section4 as any).l5}</li>}
                    </ul>
                </div>

                <div>
                    <h2>{v.section5.title}</h2>
                    <p>{v.section5.content}</p>
                </div>

                <div>
                    <h2>{v.section6.title}</h2>
                    <p>{v.section6.content}</p>
                    <ul>
                        <li>{v.section6.l1}</li>
                        {"l2" in v.section6 && <li>{(v.section6 as any).l2}</li>}
                        {"l3" in v.section6 && <li>{(v.section6 as any).l3}</li>}
                        {"l4" in v.section6 && <li>{(v.section6 as any).l4}</li>}
                        {"l5" in v.section6 && <li>{(v.section6 as any).l5}</li>}
                    </ul>
                </div>
            </section>
        </>
    );
}
