const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendMail = (name, temPassword, email, url) => {
  //initialize nodemailer
  var transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "mahi.sl@outlook.com",
      pass: "Yasantha1",
    },
  });

  const handleBar = {
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  };

  transporter.use("compile", hbs(handleBar));

  var mailOptions = {
    from: "My Notes List",
    to: email,
    subject: "My Notes List",
    text: "hi",
    template: "email",
    context: {
      name: name,
      email: email,
      temPassword: temPassword,
      url: url,
    },
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {sendMail};