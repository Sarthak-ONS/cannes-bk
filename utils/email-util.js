const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.sendMail = async function (options) {
  transporter.sendMail(
    {
      from: "herculesproject7@outlook.com",
      to: options.email,
      subject: options.subject,
      html: options.html,
    },
    (err, inf) => {
      if (err) {
        console.log("EMAIL SENT FAILED");
      }
      console.log("EMAIL SENT SUCCESSFULLY");
    }
  );
};
