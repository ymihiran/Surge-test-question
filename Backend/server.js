const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 8070;

//Connect database
mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      console.log("MongoDB connection Failed...", err.message);
      process.exit();
});



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.json("Server Started");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const userRouter = require("./routes/users.routes.js");
app.use("/user", userRouter);