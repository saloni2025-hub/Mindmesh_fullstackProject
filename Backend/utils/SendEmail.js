import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email skipped: EMAIL_USER / EMAIL_PASS not set in .env');
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"MindMesh" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};

export default sendEmail;