const express = require("express");
const app = express();
const mysql = require("mysql");
const path = require("path");
const dotnev = require("dotenv");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
///////////model//////////////////////
dotnev.config({path : ".env"});
var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
///////////view//////////////////////
const publicDirectory = path.join(__dirname, "./public");
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'hbs');
///////////////session///////////////
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));
app.use(cookieParser());
app.get('/', function(req, res){
    res.render("index", {
    sessiondestroy:true
  });
});
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended:false}));//transfer the form data through url http://localhost:5002/auth/register
app.use(express.json());//transfer data through json
//Define routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use(cookieParser());
app.listen(5003, ()=>{
    console.log("port 5003 started");
})