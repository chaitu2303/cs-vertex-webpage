import EmailService from './emailService';

export async function sendVerificationEmail(to: string, actionLink: string) {
  return EmailService.sendVerifyEmail(to, actionLink);
}

export async function sendWelcomeEmail(to: string) {
  return EmailService.sendWelcome(to, 'User');
}

export async function sendPasswordResetEmail(to: string, link: string) {
  return EmailService.sendPasswordReset(to, 'User', link);
}

export async function sendPasswordChangedEmail(to: string) {
  return EmailService.sendPasswordChanged(to);
}

export async function sendAdminNotificationNewUser(email: string, name: string, ip: string = 'Unknown', role: string = 'Customer') {
  return EmailService.notifyAdminNewUser({ name, email, ip, role });
}

export async function sendQuoteSubmissionEmail(to: string, name: string, service: string) {
  return EmailService.sendQuoteConfirmation(to, name, service);
}

export async function sendApplicationStatusEmail(to: string, name: string, program: string, status: string) {
  return EmailService.sendRaw(to, `Application Update: ${program}`, `<p>Hi ${name}, your application status is now: ${status}.</p>`);
}

export async function sendConsultationCustomerEmail(to: string, name: string) {
  // Using generic meeting confirm without date/time since it's just a request
  return EmailService.sendMeetingConfirmation(to, name, 'TBD', 'TBD');
}

export async function sendConsultationAdminNotification(data: Record<string, any>) {
  return EmailService.notifyAdminConsultation(data);
}

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  return EmailService.sendRaw(to, subject, html);
}
