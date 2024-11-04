const nodemailer = require("nodemailer");
const catchAsyncError = require("../middlewares/catchAsyncError");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure:true,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.sendEmail,
    subject: options.subject,
    text: options.message,
  };
 await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

  // verify connection configuration
//   transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });