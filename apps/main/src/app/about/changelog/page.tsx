export default function ChangelogPage() {
    return (
        <>
            <h1>Changelog</h1>
            <p>A log of notable updates and changes to the Shimokitan platform.</p>

            <h2>v2.0.26 -- February 2026</h2>
            <p><strong>Legal Compliance and Foundation</strong></p>
            <ul>
                <li>Complete rewrite of all legal pages (Privacy Policy, Terms of Service, Cookie Policy, Copyright Policy, Community Guidelines).</li>
                <li>Added Affiliate Disclosure page.</li>
                <li>Strengthened admin authentication security.</li>
                <li>Added copy-as-markdown functionality to legal and about pages.</li>
                <li>Refined coming-soon page to remove data collection.</li>
            </ul>

            <h2>v2.0.0 -- January 2026</h2>
            <p><strong>Core Reactivation</strong></p>
            <ul>
                <li>Complete rewrite of the platform on Next.js App Router.</li>
                <li>Integrated Drizzle ORM with Neon PostgreSQL.</li>
                <li>Built the admin console for artifact, entity, and collection management.</li>
                <li>Implemented the new UI design system with CyberpunkShell and district theming.</li>
                <li>Added R2 asset pipeline for image processing and storage.</li>
            </ul>

            <h2>v1.5.0 -- December 2025</h2>
            <p><strong>Initial Signal</strong></p>
            <ul>
                <li>Beta launch of the artifact submission system.</li>
                <li>Basic search functionality.</li>
                <li>First iteration of the district concept and navigation.</li>
            </ul>
        </>
    );
}
