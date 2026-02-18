import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per hour

const rateLimit = new Map<string, { count: number; expires: number }>();

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().optional(),
    message: z.string().min(1, "Message is required"),
});

function escapeHtml(unsafe: string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        const limitData = rateLimit.get(ip);

        // Clean up expired entries if found
        if (limitData && now > limitData.expires) {
            rateLimit.delete(ip);
        }

        const currentLimit = rateLimit.get(ip);

        if (currentLimit) {
            if (currentLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
                return NextResponse.json(
                    { error: 'Too many requests. Please try again later.' },
                    { status: 429 }
                );
            }
            currentLimit.count++;
        } else {
            rateLimit.set(ip, {
                count: 1,
                expires: now + RATE_LIMIT_DURATION
            });
        }

        const json = await request.json();
        const result = contactSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = result.data;

        // Determine recipient based on subject
        let recipient = 'hello@shimokitan.live';
        if (subject === 'support') recipient = 'support@shimokitan.live';
        else if (subject === 'partnership') recipient = 'partners@shimokitan.live';
        else if (subject === 'bug') recipient = 'support@shimokitan.live';

        const emailSubject = `[Contract Request] ${subject || 'General Inquiry'} from ${name}`;

        // Prevent XSS in email clients
        const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
        const safeName = escapeHtml(name);
        const safeSubject = escapeHtml(subject || '');

        const data = await resend.emails.send({
            from: 'contact@mail.shimokitan.live',
            to: recipient,
            subject: emailSubject,
            html: `
                <h1>New Transmission from ${safeName}</h1>
                <p><strong>Channel:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${safeSubject}</p>
                <hr />
                <p><strong>Message:</strong></p>
                <p>${safeMessage}</p>
                <hr />
                <p><small>Sent from Shimokitan Contact Form</small></p>
            `,
            replyTo: email,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send transmission' },
            { status: 500 }
        );
    }
}
