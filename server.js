const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const proxy = require("express-http-proxy");

const app = express();

//Bodyparser Middleware
app.use(express.json());

//DB config
const db = config.get("mongoURI");

//Connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//reverse proxy
app.use("/evaluator", proxy("localhost:3001/"));
app.use("/middleman", proxy("localhost:3002/"));
app.use("/buyer", proxy("localhost:3003/"));
app.use("/dealer", proxy("localhost:3004/"));
app.use("/seller", proxy("localhost:3005/"));

//Use Routes
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
