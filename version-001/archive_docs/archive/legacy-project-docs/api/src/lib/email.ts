import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
	to,
	subject,
	text,
	html,
}: {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}) {
	try {
		// For now, just log the email in development
		console.log("📧 Email would be sent:");
		console.log("To:", to);
		console.log("Subject:", subject);
		console.log("Content:", html || text);

		// TODO: Implement proper email sending when Resend API is configured
		// const data = await resend.emails.send({
		//   from: process.env.EMAIL_FROM || 'SaaS Starter <onboarding@resend.dev>',
		//   to: [to],
		//   subject,
		//   text: text || undefined,
		//   html: html || undefined,
		// });

		return { id: "dev-email" };
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
}
