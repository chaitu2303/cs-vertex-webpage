import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, interest, message, sourcePage } = body
    
    // 1. Server-side validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }
    
    const finalName = name || "Website Visitor"
    const finalInterest = interest || sourcePage || "General"
    const finalMessage = message || ""
    
    const normalizedEmail = email.trim().toLowerCase()
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // 2. Spam protection / Rate limiting
    // Prevent duplicate submissions from the same email within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const recentSubmission = await prisma.notifyMe.findFirst({
      where: {
        email: normalizedEmail,
        createdAt: { gte: fiveMinutesAgo }
      }
    })

    if (recentSubmission) {
      return NextResponse.json({ error: 'You have already submitted a request recently. Please wait before submitting again.' }, { status: 429 })
    }

    // 3. Store in database
    const newRequest = await prisma.notifyMe.create({
      data: {
        name: finalName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        interest: finalInterest.trim(),
        message: finalMessage.trim() || null,
        sourcePage: sourcePage?.trim() || 'General'
      }
    })

    // 4. Create Admin Notification
    const admins = await prisma.admin.findMany()
    const notificationsToCreate = admins.map(admin => ({
      userId: admin.id,
      title: 'New Notify Me Request',
      message: `New request received from ${finalName.trim()} (${normalizedEmail}) regarding ${finalInterest}.`
    }))

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({
        data: notificationsToCreate
      })
    }

    // 5. Send Professional Confirmation Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090a0a; border: 1px solid #333; border-radius: 8px; overflow: hidden; color: #F5F1EA;">
        <div style="background-color: #111; padding: 30px; text-align: center; border-bottom: 1px solid #333;">
          <img src="https://csvertex.com/assets/logo.png" alt="CS Vertex Logo" style="height: 40px; width: auto;" />
        </div>
        
        <div style="padding: 40px 30px; background-color: #090a0a;">
          <h2 style="color: #fff; margin-top: 0; margin-bottom: 20px; font-weight: 500;">Thank You, ${finalName}!</h2>
          
          <p style="color: #ccc; line-height: 1.6; margin-bottom: 25px;">
            We have successfully received your inquiry regarding <strong>${finalInterest}</strong>. Our team is reviewing your request and will get back to you shortly.
          </p>

          <div style="background-color: #111; padding: 20px; border-radius: 6px; border: 1px solid #222; margin-bottom: 25px;">
            <h3 style="color: #ff5c2a; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Submitted Details:</h3>
            <p style="margin: 5px 0; color: #bbb;"><strong>Name:</strong> ${finalName}</p>
            <p style="margin: 5px 0; color: #bbb;"><strong>Email:</strong> ${normalizedEmail}</p>
            ${phone ? `<p style="margin: 5px 0; color: #bbb;"><strong>Phone:</strong> ${phone}</p>` : ''}
            ${finalMessage ? `<p style="margin: 5px 0; color: #bbb;"><strong>Message:</strong> ${finalMessage}</p>` : ''}
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.5; padding-top: 10px;">
            <strong>Expected Response Time:</strong> Typically within 2-4 business hours.
          </p>

          <p style="color: #888; font-size: 14px; line-height: 1.5;">
            If you need immediate assistance, please feel free to <a href="mailto:hello@csvertex.com" style="color: #ff5c2a; text-decoration: none;">contact us directly</a>.
          </p>
        </div>
        
        <div style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #333;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            CS Vertex<br/>
            Contact: hello@csvertex.com | Phone: +91 72889 77131<br/><br/>
            &copy; ${new Date().getFullYear()} CS Vertex. All rights reserved.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'We Received Your Request - CS Vertex',
        html: emailHtml
      })
    } catch (emailErr) {
      console.error('Error sending confirmation email via Resend:', emailErr)
      // We don't want to fail the submission if email fails
    }

    return NextResponse.json({ success: true, message: 'Your request has been submitted successfully!' })
  } catch (err: any) {
    console.error('Error handling notify me submission:', err)
    return NextResponse.json({ error: 'Submission failed. Please try again later.' }, { status: 500 })
  }
}
