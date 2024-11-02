# Basic-SocialMedia-App.
This project is a part of my Backend Learning. 
This app allows users to create multiple accounts, upload a profile picture, and manage posts with various features. 💻

1) Account Creation: Sign up to create a new account, set up your profile, and upload a profile picture.
2) Login and Logout: Securely log in to access your account and log out when needed.
3) Post Management: Create multiple posts, each with the ability to:
 - Like: Show appreciation for posts.
 - Edit: Make changes to your posts as needed.
 - Delete: Remove posts you no longer want.
Each user can manage their own account and posts, ensuring a personalized experience.

-------------------------------------------------------------------------------------

Initialize a new Node.js project:

```
npm init -y
```
Installing Dependencies
Run the following command to install the required packages:


```
npm install express ejs mongoose dotenv multer
Express: Web framework for Node.js.
EJS: Templating engine for rendering HTML.
Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
dotenv: Module to load environment variables from a .env file.
Multer: Middleware for handling multipart/form-data, primarily used for file uploads.
```

Create a file named app.js:

```
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.render('index'); // render index.ejs
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

```
Create a ```.env``` file in your project root and add your MongoDB URI:

```
MONGODB_URI=mongodb://localhost:27017/your-database-name
PORT=3000
```


Create a directory for file uploads:
Create a simple EJS view (views/index.ejs):



```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
</head>
<body>
    <h1>Upload a File</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <button type="submit">Upload</button>
    </form>
</body>
</html>
```
Environment Variables
Store sensitive information such as your MongoDB connection string and other configurations in the ```.env``` file. Never commit this file to your version control system.

Contributing
If you’d like to contribute, please fork the repository and submit a pull request.

-------------------------------------------------
## Managed By - Kashyap Ghodasara 
-------------------------------------------------


