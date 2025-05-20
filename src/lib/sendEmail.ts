"use server";
import nodemailer from "nodemailer";

export async function sendEmail({
    to,
    subject,
    content,
}: {
    to: string;
    subject: string;
    content: string;
}) {
    if (process.env.IS_DEV === undefined) {
        throw new Error("Missing required environment variable: IS_DEV");
    }
    if (process.env.IS_DEV !== "development") {
        const requiredVars = [
            "SMTP_HOST",
            "SMTP_PORT",
            "SMTP_SECURE",
            "SMTP_USER",
            "SMTP_PASS",
        ];
        for (const v of requiredVars) {
            if (!process.env[v]) {
                throw new Error(`Missing required environment variable: ${v}`);
            }
        }
    }
    const env = process.env.IS_DEV;
    let transporter;
    let fromAddress;

    if (env === "development") {
        // For Dev run pnpm dlx maildev --web 1080 --smtp 1025
        transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            secure: false,
            ignoreTLS: true,
        });
        fromAddress = "dev@localhost.com";
    } else {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Boolean(process.env.SMTP_SECURE),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        fromAddress = process.env.SMTP_USER || "no-reply@example.com";
    }

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to: to.toLowerCase().trim(),
            subject: subject.trim(),
            text: content.trim(),
        });

        if (env === "development") {
            console.log("Email sent (dev mode):", info.messageId);
            console.log("Preview URL: http://localhost:1080");
        } else {
            console.log("Email sent (prod mode):", info.messageId);
        }

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message:
                env === "development"
                    ? "Failed to send email. Is your local MailDev/MailHog running?"
                    : "Failed to send email. Check your SMTP configuration.",
        };
    }
}
