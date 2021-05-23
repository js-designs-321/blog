//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Let just not build websites, let's build models that will make a difference."
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  body: String
}

const Post = mongoose.model('Post',postSchema);

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    if(err){
      console.log(err);
    }else{
      res.render("home",{
        content:homeStartingContent,
        posts:posts
      });
    }
  });
});

app.get("/contact",function(req,res){
  res.render("contact");
})

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save();
  res.redirect("/");
  // const post = {
  //   postTitle : req.body.postTitle,
  //   postBody : req.body.postBody
  // }
  // posts.push(post);
  // res.redirect("/");
})

app.get("/posts/:postId",function(req,res){
  let requestedPost = req.params.postId;

  Post.findOne({_id:requestedPost},function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("post",{
        title: post.title,
        content: post.body
      });
    }
  })

  // posts.forEach(function(post){
  //   let storedTitle = _.lowerCase(post.postTitle);
  //   if(requestedTitle === storedTitle){
  //     res.render("post",{
  //       title: post.postTitle,
  //       content: post.postBody
  //     });
  //   }
  // })
})


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port: ",port);
});
