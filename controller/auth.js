const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 8;
var session;
//const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const path1 = require("path");
const securedb = path1.join(__dirname, "../.env");
require("dotenv").config({path: path1.resolve(__dirname, '../.env')});
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USERNAME || "appuser",
    password: process.env.DATABASE_PASSWORD  || "/o7Ao1Rofp_3-nJi",
    database: process.env.DATABASE || "appusers"
  });
  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  //export register's as a public function to use in any file like "/auth/register" will get e meaning->ES6
exports.register = (req,res) => {
    //console.log(req.body);
    const {name, email, password, passwordConfirm} = req.body;
    db.query("SELECT * FROM `users`  WHERE `email` = ?", [email], async(error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: "This email is already in use"
            });
        }else
        if(password !== passwordConfirm) {
            return res.render('register', {
                message: "Passwords don't match"
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        db.query("INSERT into users SET ? ", {name: name, email: email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                //////////////create session///////////////
                session=req.session;
                //session middleware
                return res.render('register', {
                    message:'User successfully registered!'
                });
            }
        });
    });
}
//////////////////////////login/////////////
exports.login = (req,res) => {
    console.log(req.body);
    const {username, passwordcheck} = req.body;
    db.query("SELECT * FROM `users`  WHERE `email` = ?",  [username], async(error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0){
            //let hashedPassword = await bcrypt.hash(password3, 8);
            db.query("SELECT `password` FROM `users` WHERE `email` = ?",  [username], (error, results, fields) => {
                if(error){
                    throw error;
                }
                console.log(results[0]['password']);
                datapass = toString(results[0]['password']);
                //if(results[0]['password'] == hashedPassword){
                if(bcrypt.compare(passwordcheck, datapass)){
                    session=req.session;
                    session.user_id = [username];
                    //redirect to homepage
                        return res.render('index', {
                        message:'User successfully logged in!', thissession:true
                    });
                }else{
                    return res.render('login', {
                    message:'Please TRY Again'
                    });
                }
                //create session
            });
        }else{
            return res.render('login', {
                message:'User does not exist!'
            });
        }
    });
}
exports.logout = (req,res) => {
    req.session.destroy();
    return res.render('index', {
        sessiondestroy : true
    });
}
