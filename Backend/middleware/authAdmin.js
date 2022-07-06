const User = require("../models/user.model.js");

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    console.log("user", req.user);
    if (user.accountType != "Admin")
      return res.status(500).json({ msg: "Admin resources access denied." });

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;