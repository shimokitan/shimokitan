import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per hour

const rateLimit = new Map<string, { count: number; expires: number }>();

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

        const { name, email, subject, message } = await request.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Determine recipient based on subject
        let recipient = 'contact@shimokitan.live';
        if (subject === 'support') recipient = 'support@shimokitan.live';
        else if (subject === 'partnership') recipient = 'business@shimokitan.live';
        else if (subject === 'bug') recipient = 'engineering@shimokitan.live';

        const emailSubject = `[Contract Request] ${subject || 'General Inquiry'} from ${name}`;

        const data = await resend.emails.send({
            from: 'contact@mail.shimokitan.live',
            to: recipient,
            subject: emailSubject,
            html: `
                <h1>New Transmission from ${name}</h1>
                <p><strong>Channel:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr />
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
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
