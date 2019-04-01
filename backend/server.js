const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

const semRoute = require("./api/sem/route");
const userRoute = require("./api/user/route");
const classRoute = require("./api/class/route");
const authRoute = require("./api/auth/route");

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );
  
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: "cangvonghiacangtot",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/sem", semRoute);
app.use("/api/users", userRoute);
app.use("/api/class", classRoute);
app.use("/api/auth", authRoute);

mongoose.connect(
  "mongodb://sem2project:sem2project@ds125616.mlab.com:25616/sem2project",
  { useNewUrlParser: true },
  err => {
    if (err) console.log(err);
    else console.log("connect DB success");
  }
);

const port = process.env.PORT || 6969;

app.listen(port, err => {
  if (err) console.log(err);
  else console.log("SERVER START WITH: " + port);
});
