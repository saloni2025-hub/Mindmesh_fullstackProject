import 'dotenv/config';

console.log('USER:', JSON.stringify(process.env.EMAIL_USER));
console.log('PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT FOUND');