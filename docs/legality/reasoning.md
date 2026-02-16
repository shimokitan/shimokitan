# Legal Implementation Reasoning

This document outlines the rationale behind the revisions made to the Shimokitan legal pages following the assessments.

## 1. Implemented Changes (The "Must-Fix")

These items were prioritized because they closed genuine legal gaps or corrected factual inaccuracies with minimal operational overhead.

### Privacy Policy Updates
*   **Contact Form Transparency**: Clarified that emails are received via Hostinger Mail and may be forwarded to Gmail. Claiming "no storage" when an inbox exists is a factual lie that creates liability.
*   **Cloudflare Specificity**: Replaced "not under our control" with concrete retention data (72-hour logs). This demonstrates technical competence and transparency.
*   **GDPR/EEA Acknowledgement**: Added a single sentence regarding the right to lodge complaints. While enforcement against a solo Indonesian operator is unlikely, omitting it is an amateur signal that invites scrutiny.

### Copyright Policy Updates
*   **Thumbnail Reframing**: Removed the "search engine" analogy. Shimokitan is an editorial curation platform, not a crawler. Reframing toward "editorial review and cultural documentation" aligns better with narrow legal exceptions for criticism and review.
*   **Rights Holder Notice**: Added a good-faith declaration. In copyright disputes, demonstrating intent and providing a clear path for "friendly" resolution is the best first-line defense.
*   **SLA Tightening**: Reduced the response window from 10 days to 48 hours. Major rights holders (especially Japanese studios/labels) expect rapid compliance. A 10-day window is viewed as non-compliant in many jurisdictions.

---

## 2. Rejected / Deferred Items (The "Overkill")

The following recommendations were rejected to avoid "compliance theater" or premature optimization for a solo-operator launch.

### Operational Overkill
*   **Accessibility Statement**: Not a legal requirement for an indie launch. While inclusive, it adds maintenance overhead for a placeholder benefit at this stage.
*   **Separate Email Ticket System**: Using aliases (`legal@`, `privacy@`) is sufficient for a solo operator. A ticketing system adds unnecessary complexity before the site has traffic.
*   **Watermarking Thumbnails**: Operationally impractical for a curated index. Adding visible attribution is a "strategic" move better handled through metadata in the UI rather than a hard requirement in the legal doc.

### Strategic Rejections
*   **Age Limit (16/18)**: We are sticking to the COPPA-standard 13+. Raising the age limit without explicit adult content creates unnecessary friction and doesn't provide additional legal protection for the current content type.
*   **AI/Algorithmic Disclosure**: We do not currently use ML/AI for curation or the "Shimokita Score." Disclosing features that do not exist creates confusion.
*   **Text-Only Mode**: Choosing "Bulletproof Legal" over "Product Viability" is the nuclear option. We accept the calculated risk of using thumbnails to maintain the site's aesthetic and purpose.

### Pre-Revenue Gaps
*   **E&O Insurance**: Essential if we scale and generate significant revenue. At pre-launch/pre-revenue, the $500-$2000 annual cost is better spent on infrastructure or content acquisition.

---

## 3. The "State of Risk" Summary

By implementing the fixes above, we have improved our structural defense from an estimated **30-40%** to roughly **60-70%**. 

The remaining risk is inherent to the "Curated Index" model. As long as we do not host files (No-Host Policy) and respect takedowns immediately (48hr SLA), the risk is manageable for a solo operator. The project's best legal defense remains its architecture: **Total Data Minimization.**
