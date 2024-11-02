const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    content: String
});

    // We can put ID of user inside "user" key.
    // every user has post ID and every Post has User ID

module.exports = mongoose.model("post", postSchema);