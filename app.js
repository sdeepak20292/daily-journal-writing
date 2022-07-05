//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Think about your life and write down each day. It is surprisingly simple and profoundly strong."
const aboutContent = ""

const app = express();
var posts = [];  // to store all the posts.

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "skyrex",
  database: "blog"
});
connection.connect(function(err) {
  if (err) {
    console.log("error");
  }

  console.log("database successfully connected");
});

connection.query("select title, content from posts;", function(error, rows, fields) {   // loading all data into posts array.
  if (error) {
    console.log("error");
  } else {
    var item = rows;
    item.forEach(myfunction);

    function myfunction(value, index, array) {
      var content = {
        post : value.content,
        title : value.title
      };
      posts.push(content);
    }
    // items = rows;
    console.log(item);
  }
})



app.get("/", function(req, res){
  res.render("home", {para1:homeStartingContent, posts:posts});
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent:aboutContent})
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent:contactContent})
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){

  var content = {
    post : req.body.post,
    title : req.body.title
  };
  posts.push(content);
  var query = `insert into posts values (("${req.body.title}"), ("${req.body.post}"));`  // inserting new post into databses.
  connection.query(query)
  // console.log(posts);
  res.redirect("/");

})

app.get("/post/:some", function(req, res){
  var t = _.lowerCase(req.params.some);
  posts.forEach(function(post){
    var curr = _.lowerCase(post.title);
    if(t === curr){
      res.render("post", {title:post.title, post:post.post})
    }

})})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
