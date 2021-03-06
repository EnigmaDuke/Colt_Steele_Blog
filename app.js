let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let expressSanitizer = require("express-sanitizer");
let methodOverride = require('method-override');
let app =  express();

// App config
// mongoose.connect("mongodb://localhost/REST", { useUnifiedTopology: true  });
mongoose.connect("mongodb://localhost/REST" ,{ useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //make sure that user doesn't input javascript or anything to ruin the page
app.use(methodOverride("_method")); //look for _method take whatever its equal to and treat that request as a put or delete request

/* Mongoose model config 
  Title
  Image
  Body
  Created 
*/

let blogSchema = new mongoose.Schema({
  title: String,
  image:  String,
  body: String,
  created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);


// Rest Routes

//INDEX ROUTE
app.get("/", (req, res)=>{
  res.redirect("/blogs");
})

app.get("/blogs", (req, res)=>{
  Blog.find({}, (err, blogs)=>{
    if(err){
      console.log("ERROR");
    } else{
      res.render("index", {blogs: blogs});
    }
  })
});

//NEW ROUTE
app.get("/blogs/new", (req, res)=>{
  res.render("new");
})

//CREATE ROUTE
app.post("/blogs", (req, res)=>{
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog)=>{
    if(err){
      res.render("new");
    } else {
        //then redirect to the index
      res.redirect("/blogs")
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res)=>{
  Blog.findById(req.params.id, (err, foundBlog)=>{
    if(err){
      res.redirect("/blog");
    } else {
      res.render("show", {blog : foundBlog})
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res)=>{
  // Blog.findById(req.params.id, (err, foundBlog)=>{
  //   if(err){
  //     res.redirect("/blogs")
  //   } else {
  //     res.render("edit", {blog : foundBlog})
  //   }
  // })
  res.send("updated");
});

//UPDATE ROUTE
// app.put("/blogs/:id", (req, res)=>{
//   req.body.blog.body = req.sanitize(req.body.blog.body);
//   // Blog.findByIdAndUpdate(id, newDate, callback)
//   Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
//     if(err){
//       res.redirect("/blogs");
//     } else {
//       res.redirect("/blogs/" + req.params.id);
//     }
//   });
// });

//DELETE ROUTE
app.delete("/blogs/:id", (req,res)=>{
  //destroy blog 
  Blog.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      console.log("destroy err")
      res.redirect("/blogs");
    }
    //redirect somewhere
    res.redirect("/blogs");
  });
});

app.listen(3000, process.env.PORT, ()=>{
  console.log("This server has begun...")
});
