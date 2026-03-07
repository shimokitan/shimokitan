import { getDictionary, Locale } from "@shimokitan/utils";
import { InlineMarkdown } from "@shimokitan/ui";

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = (await params).locale as Locale;
    const dict = getDictionary(locale);
    const faq = dict.legal.faq;

    return (
        <>
            <h1>{faq.title}</h1>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                const section = (faq as any)[`s${i}`];
                if (!section) return null;

                return (
                    <div key={i}>
                        <h2>{section.title}</h2>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => {
                            const q = section[`q${j}`];
                            const a = section[`a${j}`];
                            if (!q || !a) return null;

                            return (
                                <div key={j} className="mb-6">
                                    <h3 className="text-xl font-bold text-zinc-200 mb-2">{q}</h3>
                                    <p className="text-zinc-400">
                                        <InlineMarkdown text={a} />
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}
