import { MagicLinkEmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

// Initialize Resend only if API key is provided and valid
const resend =
	process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")
		? new Resend(process.env.RESEND_API_KEY)
		: null;

export interface SendMagicLinkEmailParams {
	to: string;
	magicLink: string;
}

export async function sendMagicLinkEmail({
	to,
	magicLink,
}: SendMagicLinkEmailParams) {
	try {
		if (!resend) {
			console.log("Resend not configured, magic link email not sent:", {
				to,
				magicLink,
			});
			return { success: true, message: "Email service not configured" };
		}

		const { data, error } = await resend.emails.send({
			from: "Agents Authority <auth@updates.agentsauthority.ai>",
			to: [to],
			subject: "Sign in to Agents Authority",
			react: MagicLinkEmailTemplate({
				magicLink,
				userEmail: to,
			}),
		});

		if (error) {
			console.error("Failed to send magic link email:", error);
			throw new Error(`Failed to send email: ${error.message}`);
		}

		console.log("Magic link email sent successfully:", data);
		return data;
	} catch (error) {
		console.error("Error in sendMagicLinkEmail:", error);
		throw error;
	}
}

export async function sendWelcomeEmail(to: string, userName?: string) {
	try {
		if (!resend) {
			console.log("Resend not configured, welcome email not sent:", {
				to,
				userName,
			});
			return { success: true, message: "Email service not configured" };
		}

		const { data, error } = await resend.emails.send({
			from: "Agents Authority <welcome@updates.agentsauthority.ai>",
			to: [to],
			subject: "Welcome to Agents Authority!",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6b35 0%, #4ecdc4 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">A</span>
            </div>
            <h1 style="color: #1a1a1a; font-size: 28px; font-weight: bold; margin: 0;">Welcome to Agents Authority!</h1>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
            <h2 style="color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
              ${userName ? `Hi ${userName}!` : "Welcome!"}
            </h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thank you for joining Agents Authority, the leading AI Marketing Intelligence platform. You're now ready to:
            </p>
            <ul style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              <li>Monitor your brand's AI search visibility</li>
              <li>Track competitor performance across AI platforms</li>
              <li>Get actionable insights to improve your GEO score</li>
              <li>Access real-time analytics and reports</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://app.agentsauthority.ai/dashboard" style="display: inline-block; background-color: #4ecdc4; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 24px;">
            <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">
              © ${new Date().getFullYear()} Agents Authority. All rights reserved.
            </p>
            <div style="margin-top: 16px;">
              <a href="https://agentsauthority.ai" style="color: #4ecdc4; text-decoration: none; font-size: 14px; margin-right: 16px;">Visit Website</a>
              <a href="https://agentsauthority.ai/support" style="color: #4ecdc4; text-decoration: none; font-size: 14px;">Get Support</a>
            </div>
          </div>
        </div>
      `,
		});

		if (error) {
			console.error("Failed to send welcome email:", error);
			throw new Error(`Failed to send welcome email: ${error.message}`);
		}

		console.log("Welcome email sent successfully:", data);
		return data;
	} catch (error) {
		console.error("Error in sendWelcomeEmail:", error);
		throw error;
	}
}
