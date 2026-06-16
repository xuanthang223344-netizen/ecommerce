const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"ShopVN" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Mã xác nhận đăng nhập ShopVN',
    html: `
      <h2>Mã xác nhận của bạn</h2>
      <p>Mã OTP: <strong style="font-size:24px">${otp}</strong></p>
      <p>Mã có hiệu lực trong 5 phút.</p>
    `
  });
};

module.exports = sendOTP;