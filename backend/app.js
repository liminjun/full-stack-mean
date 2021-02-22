const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require("./routes/posts");


const app = express();
mongoose.connect("mongodb+srv://lee:h0tlsbOFcFFqfk3c@cluster0.qbx4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb.");
    }).catch(() => {
        console.log("Failed to connect mongodb.");
    });


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());
app.use(postRoutes);


module.exports = app;