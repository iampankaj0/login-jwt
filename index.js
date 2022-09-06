const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes")

const app = express();
app.use(express.json());
app.use("/api", routes)

require("dotenv").config()
const dbString = process.env.DB_URL
mongoose.connect(dbString)
const dataBase = mongoose.connection

dataBase.on("error", (error)=>{
    console.log(error);
})

dataBase.once("connected", ()=>{
    console.log("DB Connected");
})


app.listen(3001, () => {
  console.log(`Server Runs On PORT ${3001}`);
});
