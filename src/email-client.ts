import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { EmailConfig, EmailInvitation, SendEmailResponse } from './types.js';

export class EmailClient {
  private config: EmailConfig;
  private resend?: Resend;
  private nodemailerTransporter?: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initializeProvider();
  }

  private initializeProvider() {
    switch (this.config.provider) {
      case 'sendgrid':
        if (!this.config.apiKey) {
          throw new Error('SendGrid API key is required');
        }
        sgMail.setApiKey(this.config.apiKey);
        break;
      
      case 'resend':
        if (!this.config.apiKey) {
          throw new Error('Resend API key is required');
        }
        this.resend = new Resend(this.config.apiKey);
        break;
      
      case 'nodemailer':
        if (!this.config.smtpConfig) {
          throw new Error('SMTP configuration is required for Nodemailer');
        }
        this.nodemailerTransporter = nodemailer.createTransport(this.config.smtpConfig);
        break;
      
      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }
  }

  async sendBookingInvitation(invitation: EmailInvitation): Promise<SendEmailResponse> {
    const htmlContent = this.generateInvitationHTML(invitation);
    const textContent = this.generateInvitationText(invitation);

    try {
      let messageId: string | undefined;

      switch (this.config.provider) {
        case 'sendgrid':
          messageId = await this.sendWithSendGrid(invitation, htmlContent, textContent);
          break;
        
        case 'resend':
          messageId = await this.sendWithResend(invitation, htmlContent, textContent);
          break;
        
        case 'nodemailer':
          messageId = await this.sendWithNodemailer(invitation, htmlContent, textContent);
          break;
      }

      return {
        success: true,
        messageId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async sendWithSendGrid(invitation: EmailInvitation, htmlContent: string, textContent: string): Promise<string> {
    const msg = {
      to: invitation.to_email,
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      subject: invitation.subject,
      text: textContent,
      html: htmlContent
    };

    const [response] = await sgMail.send(msg);
    return response.headers['x-message-id'] as string;
  }

  private async sendWithResend(invitation: EmailInvitation, htmlContent: string, textContent: string): Promise<string> {
    if (!this.resend) {
      throw new Error('Resend client not initialized');
    }

    const result = await this.resend.emails.send({
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: invitation.to_email,
      subject: invitation.subject,
      html: htmlContent,
      text: textContent
    });

    return result.data?.id || 'unknown';
  }

  private async sendWithNodemailer(invitation: EmailInvitation, htmlContent: string, textContent: string): Promise<string> {
    if (!this.nodemailerTransporter) {
      throw new Error('Nodemailer transporter not initialized');
    }

    const result = await this.nodemailerTransporter.sendMail({
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: invitation.to_email,
      subject: invitation.subject,
      text: textContent,
      html: htmlContent
    });

    return result.messageId;
  }

  private generateInvitationHTML(invitation: EmailInvitation): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meeting Invitation</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #006BFF 0%, #0056CC 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">📅 You're Invited to Book a Meeting!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
        Hi ${invitation.to_name || 'there'},
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 25px;">
        I'd like to schedule a <strong>${invitation.event_name}</strong> with you.
      </p>
      
      ${invitation.custom_message ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #006BFF;">
        <p style="margin: 0; font-style: italic; color: #555;">
          "${invitation.custom_message}"
        </p>
      </div>
      ` : ''}
      
      <!-- Meeting Details -->
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Meeting Details</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #555;">
          <li><strong>Duration:</strong> ${invitation.event_duration} minutes</li>
          <li><strong>Available Days:</strong> ${invitation.available_days.join(', ')}</li>
          <li><strong>Host:</strong> ${invitation.host_name}</li>
        </ul>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${invitation.booking_link}" 
           style="display: inline-block; background: #006BFF; color: white; padding: 16px 32px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;
                  transition: background-color 0.3s ease;">
          📅 Book Your Time Slot
        </a>
      </div>
      
      <!-- Instructions -->
      <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #0056CC;">How it works:</h4>
        <ol style="margin: 0; padding-left: 20px; line-height: 1.6; color: #555;">
          <li>Click the "Book Your Time Slot" button above</li>
          <li>Choose a date and time that works for you</li>
          <li>Enter your details and confirm</li>
          <li>You'll receive a calendar invite automatically</li>
        </ol>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Looking forward to connecting with you!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 0;">
        Best regards,<br>
        <strong>${invitation.host_name}</strong><br>
        <a href="mailto:${invitation.host_email}" style="color: #006BFF; text-decoration: none;">
          ${invitation.host_email}
        </a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        This invitation was sent via Calendly MCP Server
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateInvitationText(invitation: EmailInvitation): string {
    return `
Meeting Invitation: ${invitation.event_name}

Hi ${invitation.to_name || 'there'},

I'd like to schedule a ${invitation.event_name} with you.

${invitation.custom_message ? `Message: "${invitation.custom_message}"\n` : ''}

Meeting Details:
- Duration: ${invitation.event_duration} minutes
- Available Days: ${invitation.available_days.join(', ')}
- Host: ${invitation.host_name}

To book your time slot, please visit:
${invitation.booking_link}

How it works:
1. Click the link above
2. Choose a date and time that works for you
3. Enter your details and confirm
4. You'll receive a calendar invite automatically

Looking forward to connecting with you!

Best regards,
${invitation.host_name}
${invitation.host_email}

---
This invitation was sent via Calendly MCP Server
    `;
  }
}