const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");


const app = express();
mongoose.connect("mongodb+srv://lee:h0tlsbOFcFFqfk3c@cluster0.qbx4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb.");
    }).catch(() => {
        console.log("Failed to connect mongodb.");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join("backend/images")))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use('/', express.static(__dirname + '/public'));
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;