const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");


require("dotenv").config();

(async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected`);
  } catch (err) {
    console.log("DB error :::::::", err);
    process.exit(1);
  }
})();

const userRouter = require('./routes/userRouter');
const { auth } = require("./middleware/auth");
const verifiedRouter = require("./routes/verifiedUserRouter")

const app = express();
const sessOption = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_STORE,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native",
  }),
};

// sessOption.cookie.secure = false;


const corsOptions = {
  origin: ["http://localhost:5005"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessOption));
app.set("view engine", "ejs");
app.use(express.static('public'))

app.use("/api", userRouter);
app.use('/api/verified', auth, verifiedRouter)

const port = 5005;

app.listen(5005, () => {
  console.log(`Server started on port ${port}`);
});