//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const lodash = require("lodash")
const app = express()
const encrypt = require("mongoose-encryption")
const dotenv = require("dotenv").config()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

const uri =
  "mongodb+srv://bsmbsm2001:rw141WnSJ6iIE5cg@cluster0.6t86z.mongodb.net/User_Database?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri)
const usersDatabaseSchema = new mongoose.Schema({
  userName: String,
  password: String,
})

usersDatabaseSchema.plugin(encrypt, {
  secret: process.env.secret,
  encryptedFields: ["password"],
})
const User = new mongoose.model("User", usersDatabaseSchema)
app.route("/").get(function (req, res) {
  res.render("home")
})
app
  .route("/login")
  .get(function (req, res) {
    res.render("login")
  })
  .post(function (req, res) {
    const userName = req.body.username
    const password = req.body.password

    User.findOne({ userName: userName, password: password }).then((results) => {
      if (!results) {
        res.send("Your username or password is wrong")
      } else {
        res.render("secrets")
      }
    })
    // const newUser = new User({
    //   userName: userName,
    //   password: password,
    // })
    // newUser
    //   .save()
    //   .then((results) => {
    //     console.log(results)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  })

app
  .route("/register")
  .get(function (req, res) {
    res.render("register")
  })
  .post(function (req, res) {
    const userName = req.body.username
    const password = req.body.password
    const newUser = new User({
      userName: userName,
      password: password,
    })
    newUser
      .save()
      .then((results) => {
        console.log(results)
      })
      .catch((err) => {
        console.log(err)
      })
    res.render("secrets")
  })

app.listen(3010, function (req, res) {
  console.log("server is running at port 3010")
})
