import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Email {
  constructor(user, url, otp) {
    this.to = user.email;
    this.firstName = user.name?.split(' ')[0] || 'User';
    this.url = url;
    this.otp = otp;
    this.from = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`;
  }

  // Create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use SendGrid for production
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Use Mailtrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject, context = {}) {
    try {
      // 1) Render HTML based on a pug template
      const templatePath = join(
        dirname(__dirname),
        'views',
        'email',
        `${template}.pug`
      );

      const html = pug.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
        subject,
        ...context,
      });

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.error('Error sending email:', err);
      throw new Error('There was an error sending the email. Please try again later.');
    }
  }

  // Send welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendOTP() {
    await this.send('otp', 'Your OTP for Email Verification', { otp: this.otp });
  }

  // Send password reset email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)',
      {
        resetUrl: this.url,
        expiration: '10 minutes',
      }
    );
  }

  // Send OTP for email verification
  async sendVerificationOTP(otp) {
    await this.send('otp', 'Your OTP for Email Verification', {
      otp,
      expiration: '10 minutes',
      purpose: 'email verification',
    });
  }

  // Send booking confirmation
  async sendBookingConfirmation(bookingDetails) {
    await this.send('bookingConfirmation', 'Your Booking Confirmation', {
      ...bookingDetails,
    });
  }

  // Send booking status update
  async sendBookingStatusUpdate(bookingDetails) {
    await this.send('bookingStatusUpdate', 'Booking Status Update', {
      ...bookingDetails,
    });
  }

  // Send query response
  async sendQueryResponse(queryDetails) {
    await this.send('queryResponse', 'Response to Your Query', {
      ...queryDetails,
    });
  }
}

export default Email;
