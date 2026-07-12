// src/lib/emailTemplates.ts

const baseLayout = (content: string, preheader: string = "CS Vertex Notification") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; line-height: 1.6; }
    .container { max-width: 600px; margin: 40px auto; background-color: #0a0a0a; border: 1px solid #222222; border-top: 4px solid #FF6A00; border-radius: 8px; overflow: hidden; }
    .header { padding: 30px; text-align: center; border-bottom: 1px solid #1a1a1a; }
    .header h1 { color: #FF6A00; margin: 0; letter-spacing: 0.1em; font-size: 24px; text-transform: uppercase; }
    .content { padding: 40px 30px; }
    .content h2 { color: #ffffff; margin-top: 0; font-size: 22px; font-weight: 600; }
    .content p { color: #bbbbbb; margin-bottom: 20px; font-size: 15px; }
    .content ul { color: #bbbbbb; font-size: 15px; padding-left: 20px; }
    .content li { margin-bottom: 8px; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #FF6A00; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0 20px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .data-table th, .data-table td { padding: 10px; border-bottom: 1px solid #222; text-align: left; font-size: 14px; }
    .data-table th { color: #ffffff; width: 35%; }
    .data-table td { color: #bbbbbb; }
    .footer { padding: 25px 30px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #1a1a1a; background-color: #050505; }
    .footer a { color: #FF6A00; text-decoration: none; }
    .footer-links { margin-bottom: 15px; }
    .footer-links a { margin: 0 10px; }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
  <div class="container">
    <div class="header">
      <h1>CS VERTEX</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <div class="footer-links">
        <a href="https://csvertex.com">Website</a>
        <a href="https://csvertex.com/portal">Client Portal</a>
        <a href="mailto:hello@csvertex.com">Support</a>
      </div>
      <p>Monday–Saturday | 9:00 AM – 7:00 PM IST</p>
      <p>&copy; ${new Date().getFullYear()} CS Vertex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  // ================= CLIENT TEMPLATES =================

  clientWelcome: (name: string) => baseLayout(`
    <h2>Welcome to CS Vertex, ${name}!</h2>
    <p>Thank you for joining our platform. Your account has been successfully created.</p>
    <p>You can now explore our enterprise solutions, cutting-edge courses, and apply for our premier internship programs.</p>
    <center><a href="https://csvertex.com/portal/login" class="btn">Go to Dashboard</a></center>
  `, "Welcome to CS Vertex!"),

  clientContactConfirm: (name: string) => baseLayout(`
    <h2>Message Received</h2>
    <p>Hi ${name},</p>
    <p>Thank you for reaching out to CS Vertex. We have successfully received your message.</p>
    <p>Our support team will review your inquiry and respond to you as soon as possible, usually within 24 hours.</p>
  `, "We received your message"),

  clientQuoteConfirm: (name: string, service: string) => baseLayout(`
    <h2>Quote Request Confirmed</h2>
    <p>Hello ${name},</p>
    <p>We've received your request for a quote regarding our <strong>${service}</strong> service.</p>
    <p>Our engineering team is currently reviewing your requirements. We will prepare a customized proposal and get back to you shortly.</p>
  `, "Your quote request is being processed"),

  clientMeetingConfirm: (name: string, date: string, time: string) => baseLayout(`
    <h2>Consultation Booked</h2>
    <p>Hi ${name},</p>
    <p>Your consultation with CS Vertex is confirmed.</p>
    <table class="data-table">
      <tr><th>Date</th><td>${date}</td></tr>
      <tr><th>Time</th><td>${time}</td></tr>
    </table>
    <p>A calendar invitation with the meeting link will be sent to you separately.</p>
  `, "Meeting confirmed"),

  clientPaymentReceived: (name: string, amount: string, reference: string) => baseLayout(`
    <h2>Payment Received</h2>
    <p>Hello ${name},</p>
    <p>We have successfully received your payment of <strong>${amount}</strong>.</p>
    <p>Reference ID: ${reference}</p>
    <p>Thank you for your business. You can download your invoice from the portal.</p>
  `, "Payment successful"),

  clientInvoice: (name: string, invoiceId: string, amount: string, link: string) => baseLayout(`
    <h2>Invoice Generated</h2>
    <p>Hi ${name},</p>
    <p>A new invoice (<strong>${invoiceId}</strong>) for <strong>${amount}</strong> has been generated for your account.</p>
    <center><a href="${link}" class="btn">View Invoice</a></center>
  `, "New invoice available"),

  clientProjectStarted: (name: string, projectName: string) => baseLayout(`
    <h2>Project Initiated</h2>
    <p>Hello ${name},</p>
    <p>We are thrilled to announce that development on <strong>${projectName}</strong> has officially started!</p>
    <p>You can track the progress of your project anytime through your client portal.</p>
    <center><a href="https://csvertex.com/portal/projects" class="btn">Track Project</a></center>
  `, "Your project has started"),

  clientWeeklyProgress: (name: string, projectName: string, summary: string) => baseLayout(`
    <h2>Weekly Progress Update</h2>
    <p>Hi ${name},</p>
    <p>Here is the latest progress update for <strong>${projectName}</strong>:</p>
    <div style="padding: 15px; border-left: 3px solid #FF6A00; background: #111;">
      <p style="margin:0;">${summary}</p>
    </div>
    <center><a href="https://csvertex.com/portal/projects" class="btn">View Details</a></center>
  `, "Weekly project update"),

  clientProjectCompleted: (name: string, projectName: string) => baseLayout(`
    <h2>Project Completed</h2>
    <p>Hello ${name},</p>
    <p>We are proud to inform you that <strong>${projectName}</strong> has been successfully completed and delivered.</p>
    <p>It has been a pleasure working with you. We hope you are satisfied with the results.</p>
  `, "Your project is complete"),

  clientPasswordReset: (name: string, link: string) => baseLayout(`
    <h2>Password Reset Request</h2>
    <p>Hi ${name || 'User'},</p>
    <p>We received a request to reset your password. Click the button below to choose a new password.</p>
    <center><a href="${link}" class="btn">Reset Password</a></center>
    <p>If you did not make this request, please ignore this email.</p>
  `, "Reset your password"),

  clientOTP: (otp: string) => baseLayout(`
    <h2>Verification Code</h2>
    <p>Your one-time password (OTP) for CS Vertex is:</p>
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF6A00; text-align: center; margin: 30px 0;">
      ${otp}
    </div>
    <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
  `, "Your verification code"),

  clientVerifyEmail: (link: string) => baseLayout(`
    <h2>Verify Your Email</h2>
    <p>Please verify your email address to complete your registration with CS Vertex.</p>
    <center><a href="${link}" class="btn">Verify Email</a></center>
    <p>If you did not sign up, please ignore this email.</p>
  `, "Verify your email address"),

  clientPasswordChanged: () => baseLayout(`
    <h2>Password Changed Successfully</h2>
    <p>Your CS Vertex account password has been changed successfully.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
  `, "Your password was changed"),

  clientFeedbackThankYou: (name: string) => baseLayout(`
    <h2>Thank You for Your Feedback!</h2>
    <p>Hi ${name},</p>
    <p>We appreciate you taking the time to share your feedback with us.</p>
    <p>Your insights help us continuously improve CS Vertex to better serve you.</p>
  `, "We value your feedback"),


  clientNewsletter: (subject: string, htmlContent: string) => baseLayout(`
    ${htmlContent}
  `, subject),

  clientInternshipConfirm: (name: string, role: string) => baseLayout(`
    <h2>Application Received</h2>
    <p>Hi ${name},</p>
    <p>Your application for the <strong>${role}</strong> internship program has been successfully received.</p>
    <p>Our hiring team will review your profile and contact you if your qualifications match our current needs.</p>
  `, "Internship application received"),

  clientCourseConfirm: (name: string, courseName: string) => baseLayout(`
    <h2>Enrollment Confirmed</h2>
    <p>Hello ${name},</p>
    <p>You have successfully enrolled in <strong>${courseName}</strong>.</p>
    <p>Access your course materials through your learning dashboard.</p>
    <center><a href="https://csvertex.com/portal/learning" class="btn">Go to Dashboard</a></center>
  `, "Course enrollment successful"),


  // ================= ADMIN TEMPLATES =================

  adminNotificationLayout: (title: string, data: Record<string, any>) => {
    let rows = '';
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        rows += `<tr><th>${key}</th><td>${value}</td></tr>`;
      }
    }
    return baseLayout(`
      <h2>Admin Alert: ${title}</h2>
      <p>A new user action has been registered on the website.</p>
      <table class="data-table">
        ${rows}
      </table>
    `, "Admin Notification");
  }
};
