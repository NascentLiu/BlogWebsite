//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a Blog in which users can compose their own daily life stories and posts to the home page. A blog (a truncation of 'weblog') is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic.";
const contactContent = "My name is Bo Liu and my English name is Eric. I am a programmer who is aiming to make the suitable, safty, and convient apps for users to satisfy their demands. Now I am living in Virginia. I like playing basketball and watching movies especially Marvel. You can click";

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
 title: String,
 content: String
};

const POST = mongoose.model("POST", postSchema);


app.get("/", function(req, res){
  POST.find({},function(err,posts){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new POST({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});



app.get("/posts/:postId", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  POST.findOne({_id: requestedPostId},function(err,foundPost){
    if(!err){
      if(foundPost){
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //
  //   if (storedTitle === requestedTitle) {
  //
  //   }
  // });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
