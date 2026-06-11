import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { email, otp } = req.body;

  // আপনার জিমেইল ক্রেডেনশিয়াল 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'global.investment.incofficial@gmail.com',
      pass: 'scvm anqm wndu nyrq' 
    }
  });

  const mailOptions = {
    from: '"Solar Investment" <global.investment.incofficial@gmail.com>',
    to: email,
    subject: 'Your Registration OTP - Solar Investment',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #16a34a;">Solar Investment</h2>
          <p>Welcome! Here is your verification code to complete your registration:</p>
          <h1 style="color: #333; letter-spacing: 2px;">${otp}</h1>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
}