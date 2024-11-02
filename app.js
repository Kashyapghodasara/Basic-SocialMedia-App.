// 29-10-2024  -  Tuesday
// 30-10-2024  -  Wednesday
// 01-11-2024  -  Friday
// 02-11-2024  -  Saturday



const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user")
const postModel = require("./models/post")
const upload = require("./utils/multerconfig")


const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

app.set("view engine", "ejs");

app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
   res.render("index")
})

app.get("/profile/upload", (req, res) => {
    res.render("uploadfile")
})

app.post("/upload", isLoggedIn ,upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});

    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/profile");
    // .save() is come when we chnage anything himself.

    // console.log(req.file);
    // req.body = contains the text fields
    // req.file = contians the file formates
 })

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/")
});

app.get("/delete/:id", isLoggedIn, async (req, res) => {
    let user = await userModel.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { posts: req.params.id } }, // Use $pull to remove a specific item from an array in a MongoDB document.
    { new: true } 
  );
    res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id});
    res.render("edit", {post});
});

app.post("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id});
    let {content} = req.body;
    post.content = content;
    await post.save();

    res.redirect("/profile")
});


app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id})
    // If I write .populate('likes') then it increase the like multiple times with same account.
    // but I dont use it. The it precautions that each account has only 1 like allows.
    

    if(post.likes.indexOf(req.user._id) === -1) {
        post.likes.push(req.user._id);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user._id), 1);
    }
    await post.save();
    res.redirect("/profile");
    /* Redirecting to the Profile Page: You’re rendering the profile page
    (res.render("profile", { post })), which will likely cause an issue,
    if profile.ejs expects the full user object,
     not just post. If you only want to update likes, 
    it’s better to redirect back to the profile or send a response indicating success */
});


app.get("/profile", isLoggedIn , async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    // you dont't want to show the ID's of post, You display the post thats why we use populate();
    res.render("profile", { user });
});

app.post("/post", isLoggedIn , async (req, res) => {
    let {content} = req.body;
    // textarea name=content

    let user = await userModel.findOne({email: req.user.email});
    let post = await postModel.create({
        user: user._id,
        // Post knows who is user
        content
    }) 
    user.posts.push(post._id);
    // Now user knows which is my Post
    await user.save();
    res.redirect("/profile");
});



app.post("/register", async (req, res) => {
    let {username, name, email, age, password} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User Already Registered");

    bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                name,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({email, userid: createdUser._id}, "shhhhk");
            res.cookie("token", token);
            res.send("User Registered Successfully")
        })   
    })
})

app.post("/login", async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email});
  if(!user) return res.status(500).send("User not Found")

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            // problem Solved
            let token = jwt.sign({email, userid: user._id}, "shhhhk");
            res.cookie("token", token);
            res.status(200).redirect("/profile");
        }
        else res.redirect("/login");
    })
        
})


function isLoggedIn(req, res, next){
    if(req.cookies.token === "") return res.status(500).redirect("/login");
    else {
     let data = jwt.verify(req.cookies.token, "shhhhk", (err, decoded) => {
        if (err)  return res.status(404).redirect("/login");
       else {
        console.log("User Found...!!")
        req.user = decoded;
       }
       next();
      });
    }  
}

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
