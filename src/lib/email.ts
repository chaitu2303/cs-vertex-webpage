import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');

// Default sender address
const fromAddress = 'hello@csvertex.com';

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Welcome to CS Vertex',
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to CS Vertex, ${name}!</h2>
        <p>Thank you for joining our Customer Portal. We are excited to collaborate with you on your next software, AI, or IoT project.</p>
        <p>You can now log in to your dashboard to request quotes, track your projects, or apply to our learning programs.</p>
        <br/>
        <p>Best regards,</p>
        <p>The CS Vertex Team</p>
      </div>`
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, link: string) {
  try {
    const resetUrl = link.startsWith('http') ? link : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/reset-password${link}`;
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Password Reset - CS Vertex',
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password for your CS Vertex portal account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #D4FF3E; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>`
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

export async function sendQuoteSubmissionEmail(to: string, name: string, service: string) {
  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Quote Request Received - CS Vertex',
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Thank you for your request, ${name}!</h2>
        <p>We have successfully received your quote request for our <strong>${service}</strong> service.</p>
        <p>Our engineering team is reviewing your requirements and will get back to you shortly with a comprehensive proposal and estimate.</p>
        <p>You can track the status of your quote in your Customer Portal dashboard.</p>
        <br/>
        <p>Best regards,</p>
        <p>The CS Vertex Team</p>
      </div>`
    });
    return true;
  } catch (error) {
    console.error('Failed to send quote email:', error);
    return false;
  }
}

export async function sendApplicationStatusEmail(to: string, name: string, program: string, status: string) {
  try {
    const isApproved = status.toLowerCase() === 'approved';
    const subject = isApproved 
      ? `Application Approved: ${program} - CS Vertex`
      : `Update on your application: ${program} - CS Vertex`;

    const message = isApproved
      ? `<p>Congratulations! Your application for <strong>${program}</strong> has been approved.</p><p>Log in to your portal to see further instructions and next steps.</p>`
      : `<p>Thank you for applying to <strong>${program}</strong>.</p><p>We have updated the status of your application to: <strong>${status}</strong>.</p><p>For more details, please check your learning dashboard.</p>`;

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        ${message}
        <br/>
        <p>Best regards,</p>
        <p>The CS Vertex Education Team</p>
      </div>`
    });
    return true;
  } catch (error) {
    console.error('Failed to send application status email:', error);
    return false;
  }
}

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Failed to send generic email:', error);
    return false;
  }
}
