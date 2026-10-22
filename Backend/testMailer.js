import 'dotenv/config';
import sendEmail from './utils/SendEmail.js';

await sendEmail({
  to: process.env.EMAIL_USER,
  subject: 'MindMesh test',
  html: '<h2>Nodemailer chal gaya!</h2>',
});