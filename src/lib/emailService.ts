import { Resend } from 'resend';
import { prisma } from './prisma';
import { emailTemplates } from './emailTemplates';

// Setup Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  templateName?: string;
  replyTo?: string;
}

// Basic in-memory queue for simple rate-limiting
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class EmailService {
  private static isSending = false;
  private static queue: (() => Promise<void>)[] = [];

  /**
   * Processes the queue sequentially to respect rate limits.
   */
  private static async processQueue() {
    if (this.isSending) return;
    this.isSending = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        await delay(200); // 200ms rate limit delay
      }
    }

    this.isSending = false;
  }

  /**
   * Core send function with retries and logging.
   */
  public static async sendWithRetry(options: SendEmailOptions, maxRetries = 3): Promise<boolean> {
    const fromName = process.env.MAIL_FROM_NAME || 'CS Vertex';
    const fromEmail = process.env.MAIL_FROM_EMAIL || 'hello@csvertex.com';
    const sender = `${fromName} <${fromEmail}>`;

    // 1. Create DB log entry
    let logEntry;
    try {
      logEntry = await prisma.emailLog.create({
        data: {
          to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
          from: sender,
          subject: options.subject,
          templateName: options.templateName || 'custom',
          status: 'PENDING',
        }
      });
    } catch (dbErr) {
      console.error('Failed to create EmailLog:', dbErr);
    }

    // 2. Retry Logic
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const { data, error } = await resend.emails.send({
          from: sender,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          replyTo: options.replyTo || process.env.REPLY_TO || fromEmail,
        });

        if (error) {
          throw new Error(error.message);
        }
        
        if (logEntry) {
          await prisma.emailLog.update({
            where: { id: logEntry.id },
            data: { status: 'SENT', retries: attempt }
          });
        }
        return true;
      } catch (error: any) {
        attempt++;
        console.error(`Email send failed (Attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt >= maxRetries) {
          if (logEntry) {
            await prisma.emailLog.update({
              where: { id: logEntry.id },
              data: { status: 'FAILED', retries: attempt, errorMessage: error.message }
            });
          }
          return false;
        }
        // Exponential backoff
        await delay(1000 * Math.pow(2, attempt));
      }
    }
    return false;
  }

  /**
   * Queue an email to be sent.
   */
  public static queueEmail(options: SendEmailOptions) {
    return new Promise<boolean>((resolve) => {
      this.queue.push(async () => {
        const success = await this.sendWithRetry(options);
        resolve(success);
      });
      this.processQueue();
    });
  }

  // ================= EXPORTED METHODS FOR FORMS =================

  // --- CLIENT EMAILS ---
  public static async sendWelcome(to: string, name: string) {
    return this.queueEmail({
      to,
      subject: 'Welcome to CS Vertex',
      html: emailTemplates.clientWelcome(name),
      templateName: 'clientWelcome'
    });
  }

  public static async sendOTP(to: string, otp: string) {
    return this.queueEmail({
      to,
      subject: 'Your CS Vertex Verification Code',
      html: emailTemplates.clientOTP(otp),
      templateName: 'clientOTP'
    });
  }

  public static async sendPasswordReset(to: string, name: string, link: string) {
    return this.queueEmail({
      to,
      subject: 'Reset your CS Vertex Password',
      html: emailTemplates.clientPasswordReset(name, link),
      templateName: 'clientPasswordReset'
    });
  }

  public static async sendContactConfirmation(to: string, name: string) {
    return this.queueEmail({
      to,
      subject: 'We received your message - CS Vertex',
      html: emailTemplates.clientContactConfirm(name),
      templateName: 'clientContactConfirm'
    });
  }

  public static async sendQuoteConfirmation(to: string, name: string, service: string) {
    return this.queueEmail({
      to,
      subject: 'Your Quote Request - CS Vertex',
      html: emailTemplates.clientQuoteConfirm(name, service),
      templateName: 'clientQuoteConfirm'
    });
  }

  public static async sendMeetingConfirmation(to: string, name: string, date: string, time: string) {
    return this.queueEmail({
      to,
      subject: 'Consultation Confirmed - CS Vertex',
      html: emailTemplates.clientMeetingConfirm(name, date, time),
      templateName: 'clientMeetingConfirm'
    });
  }

  public static async sendProjectStarted(to: string, name: string, project: string) {
    return this.queueEmail({
      to,
      subject: 'Project Initiated - CS Vertex',
      html: emailTemplates.clientProjectStarted(name, project),
      templateName: 'clientProjectStarted'
    });
  }

  public static async sendInternshipConfirm(to: string, name: string, role: string) {
    return this.queueEmail({
      to,
      subject: 'Application Received - CS Vertex',
      html: emailTemplates.clientInternshipConfirm(name, role),
      templateName: 'clientInternshipConfirm'
    });
  }

  // --- ADMIN EMAILS ---
  private static async notifyAdmin(subject: string, data: Record<string, any>) {
    const adminEmail = process.env.ADMIN_EMAIL || 'hello@csvertex.com';
    return this.queueEmail({
      to: adminEmail,
      subject: `ADMIN ALERT: ${subject}`,
      html: emailTemplates.adminNotificationLayout(subject, data),
      templateName: 'adminNotification'
    });
  }

  public static async notifyAdminContactSubmit(data: any) {
    return this.notifyAdmin('New Contact Form Submitted', data);
  }

  public static async notifyAdminQuoteRequest(data: any) {
    return this.notifyAdmin('New Quote Request', data);
  }

  public static async notifyAdminConsultation(data: any) {
    return this.notifyAdmin('New Consultation Booked', data);
  }

  public static async notifyAdminInternshipApp(data: any) {
    return this.notifyAdmin('New Internship Application', data);
  }

  public static async notifyAdminNewUser(data: any) {
    return this.notifyAdmin('New User Registration', data);
  }

  // Generic fast send for legacy compatibility
  public static async sendRaw(to: string, subject: string, html: string) {
    return this.queueEmail({ to, subject, html, templateName: 'raw' });
  }
}

export default EmailService;
