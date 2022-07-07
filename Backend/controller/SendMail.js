const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendMail = (name, temPassword, email, url) => {
  //initialize nodemailer
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sliit.rmt@gmail.com",
      pass: "mvvarvjzcwfxwuft",
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
    from: "NotesPal List",
    to: email,
    subject: "NotesPal Account Created",
    text: "Hello",
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