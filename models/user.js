const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/-your-DB-name-")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));


const userSchema = mongoose.Schema ({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilepic: {
        type: String,
        default: "default.jpg"
    },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "post"}]
    // post is an Array of ID's
})

module.exports = mongoose.model("user", userSchema);