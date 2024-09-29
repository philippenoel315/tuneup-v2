const nodemailer = require('nodemailer');


// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',  // Correct SMTP server for Office 365
//     port: 465,                  // Port 465 for SSL/TLS
//     secure: true,               // Secure must be true when using port 465
//     auth: {
//       user: 'admin@affutagepro.com',  // Your Office 365 email
//       pass: 'ZUF6xvf1yqt!myb-ceq'     // Your Office 365 password
//     }
//   });

  var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Office 365 server
    port: 587,     // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
        user: 'admin@affutagepro.com',
        pass:'ZUF6xvf1yqt!myb-ceq'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});


const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Affutage Pro" <admin@affutagepro.com>',
      to,
      subject,
      text,
      html
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
