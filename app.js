var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
// var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blogapp", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
// app.use(expressSanitizer);

var blogSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now}
});

var Blogs = mongoose.model("blogs", blogSchema);

/* Blogs.create(
    {
        title: " testni blog",
        image: "https://nova-akropola.com/wp-content/uploads/2015/05/filozofija-covjek-i-priroda-tunel-ljubavi.jpg",
        body: " neki opis"
    }); */

app.get("/", function(req,res){
    res.redirect("/blogs");
});

// INDEX ROUTE - SHOW ALL BLOGS

app.get("/blogs", function(req,res){
    Blogs.find({}, function (err, blogs) {
        if (err)
            console.log(err);
        else
            res.render("index", { blogs : blogs });
    });
});

//NEW ROUTE - SHOW FORM

app.get("/blogs/new", function(req,res){
    res.render("new");
});

// CREATE NEW BLOG

app.post("/blogs", function(req,res){
    var newBlog = { title : req.body.title, image : req.body.image, body : req.body.body};
    Blogs.create(newBlog, function (err, blog){
        if (err)
            console.log(err);
        else {
            res.redirect("/blogs");
        }
    });
});

// SHOW - SHOWS MORE INFO

app.get("/blogs/:id", function(req,res){
    Blogs.findById(req.params.id, function (err,blog){
        if (err)
            console.log(err);
        else {
            res.render("show", { blog: blog });
        }
    });
});

// EDIT - CHANGE INFO

app.get("/blogs/:id/edit", function(req,res){
    Blogs.findById(req.params.id, function(err,blog){
        if (err)
            red.redirect("/blogs");
        else {
            res.render("edit", { blog: blog });
        }
    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req,res){
    Blogs.findByIdAndUpdate(req.params.id, req.body, function(err,blog){
        if (err)
            res.redirect("/blogs");
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DESTROY ROUTE - DELETE BLOG

app.delete("/blogs/:id", function(req,res){
    Blogs.findByIdAndRemove(req.params.id, req.body, function(err){
        res.redirect("/blogs");
    });
});

app.listen(8080, function(){
    console.log("Server started");
});